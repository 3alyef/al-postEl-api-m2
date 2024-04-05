import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import SocketIo from "../../SocketIo";
import { DecodedData } from "../../../../custom";


export function expectUsers(this: SocketIo, socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const decoded: DecodedData = socket.auth;
    const userSoul = decoded.userSoul;
    const rooms = this.roomsExpectUsers.get(userSoul);
    
    if(rooms){
        rooms.forEach((room)=>{
            socket.join(room);
            
            socket.emit("updateAll", `Você foi adicionado na sala: ${room}`)
            const msgs = this.previousMessages.get(room)
            msgs?.forEach((e)=>{
                socket.emit("previousMsgs", e)
            })
        })
    }

    next(); 
}