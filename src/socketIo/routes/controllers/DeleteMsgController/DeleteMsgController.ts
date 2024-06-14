import { Socket } from "socket.io";
import { DeleteDuoMsg, DeleteGroupMsg } from "../../../interfaces/deleteMsg.interface";
import { DeleteDuoMsg as DeleteServMsg, DeleteGroupMsg as DeleteGpMsg} from "../../../services/Services";
import { msgsResponse } from "../../../interfaces/msgs.interface";
import { msgsGroupDB } from "../../../interfaces/group.interface";

class DeleteMsgController {
    private deleteMsg: DeleteServMsg;
    private deleteGpMsg: DeleteGpMsg;
    constructor() {
        this.deleteMsg = new DeleteServMsg();
        this.deleteGpMsg = new DeleteGpMsg();
    }
    public deleteDuoMsg(socket: Socket, routeName: string,
    previousMessages: Map<string, msgsResponse[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgData: DeleteDuoMsg)=>{
            console.log("msgData", msgData);

            await this.deleteMsg.delete(msgData, previousMessages);
            socket.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: msgData.deletedTo});

            const friend = userSocketMap.get(msgData.toUser);
            if(friend){
                friend.forEach((socketFriend)=>{
                    socketFriend.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: msgData.deletedTo});
                })
            }
        })
    }

    public deleteGroupMsg(socket: Socket, routeName: string, previousGroupMessages: Map<string, msgsGroupDB[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgGroupData: DeleteGroupMsg)=>{
            console.log("msgGroupData", msgGroupData);
            
            await this.deleteGpMsg.delete(msgGroupData, previousGroupMessages)
            socket.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: msgGroupData.deletedTo});

            msgGroupData.toUsers.forEach((userFriend)=>{
                const friendSockets = userSocketMap.get(userFriend);
                if(friendSockets){
                    friendSockets.forEach((socketFriend)=>{
                        socketFriend.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: msgGroupData.deletedTo});
                    })
                    
                }
            })
        })
    }
}

export const deleteMsgController = new DeleteMsgController();
