import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";
function router( socket: Socket, io: Server ) {
    
    socket.on("createNewRoom", ()=>{
        
        console.log('você está em new room')
    })
    
}



export { router };
