import { Socket } from "socket.io";
import { DeleteDuoMsg as DeleteDuoMsgType, DeleteGroupMsg as DeleteGroupMsgType } from "../../../interfaces/deleteMsg.interface";
import { deleteDuoMsg, deleteGroupMsg} from "../../../services/Services";
import { msgsResponse } from "../../../interfaces/msgs.interface";
import { msgsGroupDB } from "../../../interfaces/group.interface";
import { DeletedToType } from "../../../services/DeleteDuoMsg/DeleteDuoMsg.service";

class DeleteMsgController {
    private socketFunction(socket: Socket, type2:boolean){
        function listener(ok: boolean){
            if(ok === true){
                console.log("ok", ok);
                if(type2){
                    socket.emit("deleteGroupMsgNext", ok);
                } else {
                    socket.emit("deleteDuoMsgNext", ok);
                }
                socket.off("returnToDeleteMsg", listener);
            }
        }
        
        socket.on("returnToDeleteMsg", listener);
    }
    public deleteDuoMsg(socket: Socket, routeName: string,
    previousMessages: Map<string, msgsResponse[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgData: DeleteDuoMsgType)=>{

            let newDeletedTo = await deleteDuoMsg.delete(msgData, previousMessages);

            const fromUser = userSocketMap.get(msgData.fromUser);
            //console.log('newDeletedTo', newDeletedTo, "msgData.toUser", msgData.toUser);
            
            if(fromUser){
                fromUser.forEach((socketUser)=>{
                    socketUser.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: newDeletedTo});
                })
            }
            const toUser = userSocketMap.get(msgData.toUser);
            if(toUser){
                toUser.forEach((socketFriend)=>{
                    socketFriend.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: newDeletedTo});
                })
            }
            this.socketFunction(socket, false);
        })
    }

    public deleteGroupMsg(socket: Socket, routeName: string, previousGroupMessages: Map<string, msgsGroupDB[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgGroupData: DeleteGroupMsgType)=>{
            //console.log("DeleteGroupMsgType", msgGroupData);
            
            await deleteGroupMsg.delete(msgGroupData, previousGroupMessages);
        
            const fromUser = userSocketMap.get(msgGroupData.fromUser);
            if(fromUser){
                fromUser.forEach((socketUser)=>{
                    socketUser.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: msgGroupData.deletedTo});
                })
            }

            msgGroupData.toUsers.forEach((userFriend)=>{
                const friendSockets = userSocketMap.get(userFriend);
                if(friendSockets){
                    friendSockets.forEach((socketFriend)=>{
                        socketFriend.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: msgGroupData.deletedTo});
                    })
                    
                }
            })
            this.socketFunction(socket, true);
        })
    }
}

export function changeDeletedTo(previous: DeletedToType, current: DeletedToType): DeletedToType {
    let newValue: DeletedToType = "none";
    //console.log("previous", previous);
    //console.log("current", current);

    if(previous === "none"){
        newValue = current;
    } else if(previous === "all"){
        if(current === "justFrom"){
            newValue = "allFrom"
        } else {
            newValue = "allTo";
        }
    } else if(previous === "allFrom" || previous === "allTo"){
        newValue = "justAll"
    } else if(previous === "justFrom"){
        if(current === "justTo"){
            newValue = "justAll";
        }
    } else if(previous === "justTo"){
        if(current === "justFrom"){
            newValue = "justAll";
        } else if(current === "all"){
            newValue = "allTo";
        }
    } 

    return newValue;
}

export {DeleteMsgController};
