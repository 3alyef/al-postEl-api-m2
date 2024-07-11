import { Server as Io, Socket } from "socket.io";
import { msgsGroupDB, ViewStatus } from '../../interfaces/group.interface';
import { mapToString, stringToMap } from "../RestoreGroup/RestoreGroup.service";


class SendGroupMsg {
    public async initialize(io: Io, socket: Socket, previousGroupMessages: Map<string, msgsGroupDB[]>, messageData: msgsGroupDB, userSocketMap:Map<string, Socket[]>){
        let viewStatus = stringToMap<string, ViewStatus>(messageData.viewStatus);


        viewStatus.forEach((vS, soul)=>{
            viewStatus.set(soul, "onServer")
        })

        // encia para o sender que a menssagem esta no servidor
        let socketsUser = userSocketMap.get(messageData.fromUser);
        if(socketsUser){
            socketsUser.forEach((socketUs)=>{
                socketUs.emit("msgGroupStatus", {createdIn: messageData.createdIn, toGroup: messageData.toGroup, viewStatus: mapToString(viewStatus)})
            })
        }

        viewStatus.forEach((vS, soul)=>{
            if(soul === messageData.fromUser){
                viewStatus.set(soul, "seen");
            } else {
                viewStatus.set(soul, userSocketMap.has(soul) ? "delivered" : "onServer")
            }
        })

        const content: msgsGroupDB = {  
            fromUser: messageData.fromUser,
            deletedTo: messageData.deletedTo,
            message: messageData.message,
            toGroup: messageData.toGroup,
            createdIn: messageData.createdIn,
            toUsers: messageData.toUsers,
            viewStatus: mapToString(viewStatus)
        }
        //console.log('viewStatusNv', content.viewStatus)
        let roomObj = previousGroupMessages.get(messageData.toGroup);
        if(!roomObj){
            roomObj = [];
            previousGroupMessages.set(messageData.toGroup, roomObj);
        }
        roomObj?.push(content);

        socket.to(messageData.toGroup).emit("newGroupMsg", {messageData: content});  
        await this.sendMessagesToM3(content)
        // envia de volta com: delivered
        if(socketsUser){
            socketsUser.forEach((socketUs)=>{
                socketUs.emit("msgGroupStatus", {createdIn: messageData.createdIn, toGroup: messageData.toGroup, viewStatus: mapToString(viewStatus)})
            })
        }
    }

    private async sendMessagesToM3(content: msgsGroupDB){
        let contentWithObjectViewStatus;
        contentWithObjectViewStatus = {
            ...content,
        };
        const body = JSON.stringify(contentWithObjectViewStatus);
        await fetch(`${process.env.URL_M3}/setNewGroupMsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
    }
}

export default SendGroupMsg;

export function viewStatusJsonToMap(jsonStr: string): Map<string, "delivered" | "seen"> {
    const obj = JSON.parse(jsonStr);
    return new Map(Object.entries(obj));
}