import { Socket } from "socket.io";
import { DeleteDuoMsg as DeleteDuoMsgType, DeleteGroupMsg as DeleteGroupMsgType } from "../../../interfaces/deleteMsg.interface";
import { deleteDuoMsg, deleteGroupMsg} from "../../../services/Services";
import { msgsResponse } from "../../../interfaces/msgs.interface";
import { msgsGroupDB } from "../../../interfaces/group.interface";
import { DecodedData } from "../../../interfaces/auth.interface";
import { DeletedToType } from "../../../services/DeleteDuoMsg/DeleteDuoMsg.service";

class DeleteMsgController {
    public deleteDuoMsg(socket: Socket, routeName: string,
    previousMessages: Map<string, msgsResponse[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgData: DeleteDuoMsgType)=>{
            //console.log("msgData", msgData);

            let newDeletedTo = await deleteDuoMsg.delete(msgData, previousMessages);

            const {userSoul}: DecodedData = socket.auth;
            const userSockets = userSocketMap.get(userSoul);
            console.log('newDeletedTo', newDeletedTo, "msgData.toUser", msgData.toUser)
            if(userSockets){
                userSockets.forEach((socketUser)=>{
                    socketUser.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: newDeletedTo.deletedTo});
                })
            }

            const friend = userSocketMap.get(msgData.toUser);
            if(friend){
                friend.forEach((socketFriend)=>{
                    socketFriend.emit("updateMsgDelDuoStatus", {room: msgData.room, createdIn: msgData.createdIn, deletedTo: newDeletedTo.deletedTo});
                })
            }
        })
    }

    public deleteGroupMsg(socket: Socket, routeName: string, previousGroupMessages: Map<string, msgsGroupDB[]>,
    userSocketMap:Map<string, Socket[]>) {
        socket.on(routeName, async (msgGroupData: DeleteGroupMsgType)=>{
            //console.log("msgGroupData", msgGroupData);
            
            let newDeletedTo = await deleteGroupMsg.delete(msgGroupData, previousGroupMessages)
            

            const {userSoul}: DecodedData = socket.auth;
            const userSockets = userSocketMap.get(userSoul);
            console.log('newDeletedTo', newDeletedTo)
            if(userSockets){
                userSockets.forEach((socketUser)=>{
                    socketUser.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: newDeletedTo.deletedTo});
                })
            }

            msgGroupData.toUsers.forEach((userFriend)=>{
                const friendSockets = userSocketMap.get(userFriend);
                if(friendSockets){
                    friendSockets.forEach((socketFriend)=>{
                        socketFriend.emit("updateMsgDelGroupStatus", {room: msgGroupData.room, createdIn: msgGroupData.createdIn, deletedTo: newDeletedTo.deletedTo});
                    })
                    
                }
            })
        })
    }
}

export function changeDeletedTo(previous: DeletedToType, current: DeletedToType): DeletedToType{
    let newValue: DeletedToType = {deletedTo: "none"};
    console.log("previous", previous);
    console.log("current", current);

    if(previous.deletedTo === "none"){
        newValue.deletedTo = current.deletedTo;
    } else if(previous.deletedTo === "all"){
        if(current.deletedTo === "justFrom"){
            newValue.deletedTo = "allFrom"
        } else {
            newValue.deletedTo = "allTo";
        }
    } else if(previous.deletedTo === "allFrom" || previous.deletedTo === "allTo"){
        newValue.deletedTo = "justAll"
    } else if(previous.deletedTo === "justFrom"){
        if(current.deletedTo === "justTo"){
            newValue.deletedTo = "justAll";
        }
    } else if(previous.deletedTo === "justTo"){
        if(current.deletedTo === "justFrom"){
            newValue.deletedTo = "justAll";
        }
    }

    return newValue;
}

export const deleteMsgController = new DeleteMsgController();
