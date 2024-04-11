import { Socket } from "socket.io";
import * as Controll from "./controllers/Controllers";
import { msgsResponse } from "../interfaces/msgs.interface";

const router = ( 
    socket: Socket,
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]>,
    previousMessages: Map<string, msgsResponse[]>
    ) => { 
    
    Controll.searchUserController.searchUser( 
        socket, 
        "searchByEmail",
        userSocketMap
    );

    Controll.createConnectionController.newConnection( 
        socket,
        "connectFriend",  
        userSocketMap,
        roomsExpectUsers,
        previousMessages
    );

    Controll.sendMsgController.sendMsg(
        socket,
        "sendMsg",
        previousMessages,
        
    );

    Controll.createNewGroupController.newGroup(
        socket,
        "newGroup",
        roomsExpectUsers
    );
    
}

export { router };
