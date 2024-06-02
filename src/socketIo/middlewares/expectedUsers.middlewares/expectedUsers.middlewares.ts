import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import SocketIo from "../../SocketIo";
import { DecodedData } from "../../interfaces/auth.interface";
import { RestoreHistory } from "../../services/RestoreHistory/RestoreHistory.service";
import { RestoreGroup } from "../../services/Services";


export async function expectUsers(this: SocketIo, socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const decoded: DecodedData = socket.auth;
    const userSoul = decoded.userSoul;

    
    let usersGroup = this.groupsExpectUsers.get(userSoul);
    if(!usersGroup){
        await new RestoreGroup().initialize( userSoul, this.groupsExpectUsers, this.groupsAdmin, this.previousGroupMessages );
    }

    usersGroup = this.groupsExpectUsers.get(userSoul);

    if(usersGroup){
        console.log("existe")
        usersGroup.forEach((group)=>{
            socket.join(group._id);
            console.log("grupo",group._id)

            const groupAdmin = this.groupsAdmin.get(group._id);
            if(groupAdmin?.includes(userSoul)){
                socket.emit("updateGroup", group)       
            } else {
                socket.emit("updateGroup", group)  
            }

            const msgs = this.previousGroupMessages.get(group._id)
            msgs?.forEach((msg)=>{
                console.log("previous messages", msg)
                socket.emit("previousGroupMsgs", msg)
            })
            
        })
        
    }
    let rooms: string[] | undefined;
    if(!this.roomsExpectUsers.has(userSoul)){
        await new RestoreHistory().initialize( userSoul, this.roomsExpectUsers, this.previousMessages, this.roomsProps );
        
    }
    rooms = this.roomsExpectUsers.get(userSoul);
    if(rooms){
        rooms.forEach((room)=>{
            const roomDatas = this.roomsProps.get(room);
            const friendData = roomDatas?.filter(el => el.userSoul != userSoul)[0];
            socket.join(room);

            socket.emit("updateAll", {message: "add_room", content: room, friendData});
            //console.log("friendDATA", friendData);
            const msgs = this.previousMessages.get(room);
            //console.log('previousMessages', this.previousMessages)
            
            if(msgs) {
                
                //console.log('msgs=>>>',msgs)
                let msgCase = msgs[0]?.fromUser;
                if(!msgCase || msgCase === userSoul){
                    msgCase = msgs[0]?.toUser;
                }
                //console.log('msgCase:', msgCase, userSoul)
                socket.emit("previousMsgs", {messageData: msgs, room, msgCase });
            }


            // Atualiza o status dos friends Online para o user
            if(friendData){
                const _isFriendOnline = this.userSocketMap.get(friendData.userSoul);
                if(_isFriendOnline && _isFriendOnline.length > 0){
                    socket.emit("updateFriendsOnline", {userSoul: friendData.userSoul, online: true});

                    // Atualiza o status do user Online to the friends
                    _isFriendOnline.forEach((socketFriend)=>{
                        socketFriend.emit("updateFriendsOnline", {userSoul: userSoul, online: true})
                    })
                }
            }

            
            
        })
    }
    next(); 
}