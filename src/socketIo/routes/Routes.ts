import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";

const router = ( 
    socket: Socket, 
    io: Server, 
    userRoomMap: Map<string, string[]>, 
    userSocketMap:Map<string, Socket[]> ) => { 
    
    Controll.searchUserController.searchUser( 
        socket, 
        io, 
        "searchByEmail",
        userSocketMap
    );

    Controll.newRoomController.newRoom( 
        socket, 
        io, 
        "newRoom",  
        userSocketMap
    );

    Controll.sendMsgController.sendMsg(
        socket, 
        io, 
        "sendMsg",
        userSocketMap
    )
        
    /*Controll.newRoomController.joinRoom(
        socket,
        io,
        "joinRoom",
        decoded
    )
*/


}

export { router };
