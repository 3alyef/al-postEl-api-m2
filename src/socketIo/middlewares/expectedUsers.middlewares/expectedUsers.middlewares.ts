import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import SocketIo from "../../SocketIo";
import { DecodedData } from "../../interfaces/auth.interface";
import { RestoreHistory } from "../../services/RestoreHistory/RestoreHistory.service";
import { RestoreGroup, verifyMsgs } from "../../services/Services";


export async function expectUsers(this: SocketIo, socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const decoded: DecodedData = socket.auth;
    const userSoul = decoded.userSoul;

    
    let usersGroup = this.groupsExpectUsers.get(userSoul);
    if(!usersGroup){
        await new RestoreGroup().initialize( userSoul, this.groupsExpectUsers, this.groupsAdmin, this.previousGroupMessages );
    }

    usersGroup = this.groupsExpectUsers.get(userSoul);

    if(usersGroup){
        //console.log("existe")
        usersGroup.forEach((group)=>{
            socket.join(group._id);
            //console.log("grupo",group._id)

            const groupAdmin = this.groupsAdmin.get(group._id);
            /*if(groupAdmin?.includes(userSoul)){
                socket.emit("updateGroup", group)       
            } else {
                socket.emit("updateGroup", group)  
            }*/
            socket.emit("updateGroup", group)
            const msgs = this.previousGroupMessages.get(group._id)
            
            console.log("messages(msgs)group", msgs)
            if(msgs){
                //console.log("prevMsgs", msgs)
                let finalMsgs = verifyMsgs.verifyGroupMsgs(msgs, userSoul); 
                console.log("currentMsgs", finalMsgs)
                socket.emit("previousGroupMsgs", {messageData: finalMsgs})
            }
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
            const msgs = this.previousMessages.get(room);
            
            if(msgs) {
                
                //console.log('msgs=>>>',msgs)
                let roomBySoulName = msgs[0]?.fromUser;
                if(roomBySoulName === userSoul){
                    roomBySoulName = msgs[0]?.toUser;
                }
                //let toDeleteMsgsIndex: number[] = []
                let indexesDel: number[] = []
                msgs.forEach((msg, index) => {
                    if (msg.deletedTo === "all") {
                        msg.message = "";
                    } else if((msg.deletedTo === "allFrom" && msg.fromUser === decoded.userSoul) || (msg.deletedTo === "allTo" && msg.toUser === decoded.userSoul)){
                        indexesDel.push(index)
                    }
                });

                if(indexesDel.length > 0) {
                    for(let i = 0; i < indexesDel.length; i++){
                        msgs.splice(indexesDel[i], 1);
                    }
                }
                
                for (let i = msgs.length - 1; i >= 0; i--) {
                    const msg = msgs[i];
                    if ((msg.deletedTo === "justFrom" && msg.fromUser === userSoul) || 
                    (msg.deletedTo === "justTo" && msg.toUser === userSoul && msg.fromUser !== userSoul) || msg.deletedTo === "allFrom") {
                        msgs.splice(i, 1);
                    }
                }
                
                //console.log('msgCase:', msgCase, userSoul)
                console.log('prvMSG', msgs)
                socket.emit("previousMsgs", {messageData: msgs, room, roomBySoulName });
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

