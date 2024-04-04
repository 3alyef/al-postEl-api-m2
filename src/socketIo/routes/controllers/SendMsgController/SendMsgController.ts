import { Server, Socket } from "socket.io";
import { sendMsg } from "../../../../../custom";

/* 
    NOTE: Todas as mensagens enviadas do tipo user1 => user2 são direcionadas à um channel especifico criado a partir da rendomização de 2 numbers + soulName1 + soulName2
*/

class SendMsgController {
    sendMsg(
        socket: Socket,
        io: Server,
        routeName: string, 
        userSocketMap:Map<string, Socket[]>
    ){
        socket.on(routeName, ({ content, to, sender, chatName }: sendMsg)=>{ 
            const payload = {
                content,
                chatName,
                sender
            };

            console.log(payload);
            socket.to(to).emit("newMsg", content);                 
        })
    }
}

const sendMsgController = new SendMsgController();

export {sendMsgController};