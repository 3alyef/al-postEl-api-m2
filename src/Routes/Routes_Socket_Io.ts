import { Socket, Server } from "socket.io";
import * as Controll from "./Controllers_Socket_Io/Controllers_SoketIo";
function routerSocket( socket: Socket, io: Server ) {
    
    socket.on("createNewRoom", ()=>{
        
        console.log('você está em new room')
    })
    
}

export { routerSocket };
