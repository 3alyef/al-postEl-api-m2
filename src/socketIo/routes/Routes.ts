import { Socket } from "socket.io";
import * as Controll from "./controllers/Controllers";
import { Message } from "../../../custom";

const router = ( 
    socket: Socket,
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]>,
    previousMessages: Map<string, Message[]>
    ) => { 
    
    Controll.searchUserController.searchUser( 
        socket, 
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
        "sendMsg",
        previousMessages
    );
    
}

export { router };
