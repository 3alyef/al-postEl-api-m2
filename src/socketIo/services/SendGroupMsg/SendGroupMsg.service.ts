import { Server as Io, Socket } from "socket.io";
import { msgsGroupDB } from '../../interfaces/group.interface';
class SendGroupMsg {
    public async initialize(io: Io, socket: Socket, previousGroupMessages: Map<string, msgsGroupDB[]>, messageData: msgsGroupDB){
        let viewStatusNv: "onServer" | Map<string, "delivered" | "seen"> = new Map()
        if(messageData.viewStatus === "onServer"){
            messageData.toUsers.forEach((user)=>{
                viewStatusNv.set(user, "delivered")
            })
        }
        
        const content: msgsGroupDB = {  
            fromUser: messageData.fromUser,
            deletedTo: messageData.deletedTo,
            message: messageData.message,
            toGroup: messageData.toGroup,
            createdIn: messageData.createdIn,
            toUsers: messageData.toUsers,
            viewStatus: viewStatusNv
        }
        
        let roomObj = previousGroupMessages.get(messageData.toGroup);
        if(!roomObj){
            roomObj = [];
            previousGroupMessages.set(messageData.toGroup, roomObj);
        }
        roomObj?.push(content);
        console.log(roomObj);

        // envia de volta com: onServer
        socket.emit("msgGroupStatus", {createdIn: messageData.createdIn, toGroup: messageData.toGroup, viewStatus: "onServer"})

        socket.to(messageData.toGroup).emit("newGroupMsg", {messageData: content});  
        await this.sendMessagesToM3(content)
        // envia de volta com: delivered
        socket.emit("msgGroupStatus", {createdIn: messageData.createdIn, toGroup: messageData.toGroup, viewStatus: messageData.viewStatus})
    }

    private async sendMessagesToM3(content: msgsGroupDB){
        const body = JSON.stringify(content);
        const response = await fetch(`${process.env.URL_M3}/setNewGroupMsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        console.log(response)
    }
}

export default SendGroupMsg;