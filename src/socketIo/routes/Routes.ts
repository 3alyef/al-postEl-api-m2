import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";

const router = ( 
    socket: Socket, 
    io: Server, 
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]> ) => { 
    
    Controll.searchUserController.searchUser( 
        socket, 
        io, 
        "searchByEmail",
        userSocketMap
    );

    Controll.newRoomController.newRoom( 
        socket,
        "newRoom",  
        userSocketMap,
        roomsExpectUsers
    );

    Controll.sendMsgController.sendMsg(
        socket, 
        io, 
        "sendMsg",
        userSocketMap
    );
    
    //Controll.updateAllController.updateAll(
  ///      socket,
  //      "updateAll",
  //      roomsExpectUsers
    //);

    /*Controll.newRoomController.joinRoom(
        socket,
        io,
        "joinRoom",
        decoded
    )
*/


}

export { router };
