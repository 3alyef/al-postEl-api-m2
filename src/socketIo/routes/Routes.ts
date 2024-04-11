import { Socket } from "socket.io";
import * as Controll from "./controllers/Controllers";
import { msgsResponse } from "../interfaces/msgs.interface";
import { msgsGroupDB } from "../interfaces/group.interface";

const router = ( 
    socket: Socket,
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]>,
    previousMessages: Map<string, msgsResponse[]>,
    groupsExpectUsers: Map<string, string[]>,
    groupsAdmin: Map<string, string[]>, previousGroupMessages: Map<string, msgsGroupDB[]>
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
        previousGroupMessages
        
    );

    Controll.createNewGroupController.newGroup(
        socket,
        "newGroup",
        groupsExpectUsers, 
        groupsAdmin,
        userSocketMap,
        
    );
    
}

export { router };
