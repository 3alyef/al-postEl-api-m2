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
    //this.groupsExpectUsers.set(userSoul, [])
    if(!rooms){
        await new RestoreHistory().initialize( userSoul, this.roomsExpectUsers, this.previousMessages );
    }
    rooms = this.roomsExpectUsers.get(userSoul);
    if(rooms){
        rooms.forEach((room)=>{
            socket.join(room);
            console.log("room"+room)
            socket.emit("updateAll", `Você foi adicionado na sala: ${room}`)
            const msgs = this.previousMessages.get(room)
            msgs?.forEach((e)=>{
                console.log('previous messages: '+e)
                socket.emit("previousMsgs", e)
            })
        })
    }




    next(); 
}