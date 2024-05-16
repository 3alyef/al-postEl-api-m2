import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import SocketIo from "../../SocketIo";
import { DecodedData } from "../../interfaces/auth.interface";
import { RestoreHistory } from "../../services/RestoreHistory/RestoreHistory.service";
import { RestoreGroup } from "../../services/Services";


export async function expectUsers(this: SocketIo, socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const decoded: DecodedData = socket.auth;
    const userSoul = decoded.userSoul;

    let rooms = this.roomsExpectUsers.get(userSoul);
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
                
                socket.emit("updateGroup", {group: group._id, isAdmin: true, groupName: group.groupName})       
            } else {
                socket.emit("updateGroup", {group: group._id, isAdmin: false, groupName: group.groupName})  
            }

            const msgs = this.previousGroupMessages.get(group._id)
            msgs?.forEach((msg)=>{
                console.log("previous messages", msg)
                socket.emit("previousGroupMsgs", msg)
            })
            
        })
        
    }
    if(!rooms){
        await new RestoreHistory().initialize( userSoul, this.roomsExpectUsers, this.previousMessages, this.roomsProps );
    }
    rooms = this.roomsExpectUsers.get(userSoul);
    if(rooms){
        rooms.forEach((room)=>{
            const roomDatas = this.roomsProps.get(room)
            const friendData = roomDatas?.filter(el => el.userSoul != userSoul)[0]

            socket.join(room);
            
            socket.emit("updateAll", {message: "add_room", 
                content: room, friendData, userSoul});
            const msgs = this.previousMessages.get(room);

            
            if(msgs){
                console.log('mensagem Array:')
                console.log(msgs)
                msgs.forEach((e)=>{
                    console.log('previous messages: ',e)
                    socket.emit("previousMsgs", {messageData: e, room })
                })
            }
            
        })
    }




    next(); 
}