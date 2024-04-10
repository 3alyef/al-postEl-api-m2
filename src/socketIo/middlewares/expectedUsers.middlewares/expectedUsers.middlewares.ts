import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import SocketIo from "../../SocketIo";
import { DecodedData } from "../../interfaces/auth.interface";
import { RestoreHistory } from "../../services/RestoreHistory/RestoreHistory.service";


export async function expectUsers(this: SocketIo, socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const decoded: DecodedData = socket.auth;
    const userSoul = decoded.userSoul;
    let rooms = this.roomsExpectUsers.get(userSoul);
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