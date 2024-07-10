import { Server as Io, Socket } from "socket.io";
import * as Controll from "./controllers/Controllers";
import { msgsResponse } from "../interfaces/msgs.interface";
import { msgsGroupDB, newGroupResponse } from "../interfaces/group.interface";
import { AllDataUser } from "../interfaces/auth.interface";

const router = ( 
    io: Io,
    socket: Socket,
    userSocketMap:Map<string, Socket[]>,
    roomsExpectUsers: Map<string, string[]>,
    previousMessages: Map<string, msgsResponse[]>,
    groupsExpectUsers: Map<string, newGroupResponse[]>,
    groupsAdmin: Map<string, string[]>,
    previousGroupMessages: Map<string, msgsGroupDB[]>,
    roomsProps: Map<string, AllDataUser[]>
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
        previousMessages,
        roomsProps
    );

    Controll.sendMsgController.sendMsg(
        io,
        socket,
        "sendMsg",
        previousMessages,
        userSocketMap
    );

    Controll.sendMsgController.sendGroupMsg(
        io,
        socket,
        "sendGroupMsg",
        previousGroupMessages
    )
    Controll.sendMsgController.msgSeenUpdate(
        socket,
        "msgSeenUpdate",
        previousMessages,
        userSocketMap
        
    );
    Controll.sendMsgController.msgSeenUpdateGroup(
        {
            socket,
            routeName: "msgSeenUpdateGroup",
            previousGroupMessages,
            userSocketMap
        }
    );

    Controll.sendMsgController.setTypingState(
        io,
        socket,
        "setTypingState",
        previousMessages,
        userSocketMap
    )

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

    Controll.profileImageController.setProfileImage(
        socket,
        "setProfileImage",
        roomsProps,
        roomsExpectUsers,
        userSocketMap
    )

    Controll.userDetailsController.getDataUser(
        socket,
        "getDataUser"
    )

    const deleteMsg = new Controll.DeleteMsgController();

    deleteMsg.deleteDuoMsg(
        socket,
        "deleteDuoMsg",
        previousMessages,
        userSocketMap
    )
    deleteMsg.deleteGroupMsg(
        socket,
        "deleteGroupMsg",
        previousGroupMessages,
        userSocketMap
    )

}

export { router };
