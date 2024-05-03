import { Socket } from "socket.io";
import * as Controll from "./controllers/Controllers";
import { msgsResponse } from "../interfaces/msgs.interface";
import { msgsGroupDB, newGroupResponse } from "../interfaces/group.interface";

const router = ( 
    socket: Socket,
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]>,
    previousMessages: Map<string, msgsResponse[]>,
    groupsExpectUsers: Map<string, newGroupResponse[]>,
    groupsAdmin: Map<string, string[]>, previousGroupMessages: Map<string, msgsGroupDB[]>
    ) => { 
    
    Controll.searchUserController.searchUser( 
        socket, 
        "searchUser",
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

    Controll.unregisterController.unregister(
        socket,
        "unregister",
        
    );
    
}

export { router };
