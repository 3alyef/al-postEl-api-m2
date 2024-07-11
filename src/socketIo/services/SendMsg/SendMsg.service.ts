import { Server as Io, Socket } from "socket.io";
import { msgsResponse } from '../../interfaces/msgs.interface';
interface SendMsgType {
    io: Io;
    socket: Socket;
    previousMessages: Map<string, msgsResponse[]>;
    fromUser: string, deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    toUser: string;
    toRoom: string;
    message: string;
    createdIn: string;
    userSocketMap:Map<string, Socket[]>
}
class SendMsg {
    public async initialize({createdIn, deletedTo, fromUser, io, message, previousMessages, socket, toRoom, toUser, userSocketMap}:SendMsgType){ 
        //const dateInf = new Date(); 
        //const data = dateInf.toISOString();

        let viewStatus: "onServer" | "delivered" = userSocketMap.has(toUser) ? "delivered" : "onServer";

        const content: msgsResponse = {  
            fromUser,
            deletedTo,
            viewStatus, 
            toUser,
            message, 
            createdIn
        }
        
        const roomObj = previousMessages.get(toRoom);
        if(!roomObj){
            const roomObj: msgsResponse[] = [];
            previousMessages.set(toRoom, roomObj);
        }
        roomObj?.push(content);

        let socketsUser = userSocketMap.get(fromUser);
        //socket.emit("msgStatus", {room: toRoom, createdIn, viewStatus: "onServer", toUser})
        if(socketsUser) {
            socketsUser.forEach((socketUs)=>{
                socketUs.emit("msgStatus", {room: toRoom, createdIn, viewStatus: "onServer", toUser});
            })
        }
        await this.sendMessagesToM3(content);
        socket.to(toRoom).emit("newMsg", {messageData: content, room:toRoom});  
        
        socket.to(toRoom).emit("msgStatus", {room: toRoom, createdIn, viewStatus, toUser});
        //socket.emit("msgStatus", {room: toRoom, createdIn, viewStatus: "delivered", toUser})
        if(socketsUser) {
            socketsUser.forEach((socketUs)=>{
                socketUs.emit("msgStatus", {room: toRoom, createdIn, viewStatus, toUser})
            })
        }
        
    }

    private async sendMessagesToM3(content: msgsResponse){
        const body = JSON.stringify(content);
        const response = await fetch(`${process.env.URL_M3}/setNewMsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        console.log(response)
    }
}

export default SendMsg;