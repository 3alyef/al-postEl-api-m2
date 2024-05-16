import { Server as Io, Socket } from "socket.io";
import { msgsResponse, sendMsg } from "../../../interfaces/msgs.interface";
import { SendGroupMsg, SendMsg } from "../../../services/Services";
import { msgsGroupDB } from "../../../interfaces/group.interface";

/* 
    NOTE: Todas as mensagens enviadas do tipo user1 => user2 são direcionadas à um channel especifico criado a partir da rendomização de 2 numbers + soulName1 + soulName2
*/

class SendMsgController {
    sendMsg(
        io:Io,
        socket: Socket,
        routeName: string, 
        previousMessages: Map<string, msgsResponse[]>,
        previousGroupMessages: Map<string, msgsGroupDB[]>
    ){
        socket.on(routeName, async ({fromUser, deletedTo, toUser, toRoom, message, isGroup, chatName, toGroup }: sendMsg)=>{ 
            const dateInf = new Date(); 
            const createdIn = dateInf.toISOString();
            if(!isGroup && toRoom){
                
                await new SendMsg().initialize(io, socket,previousMessages, fromUser, deletedTo, toUser, toRoom, message, createdIn)
            } else if(isGroup && toGroup){
                await new SendGroupMsg().initialize(io, socket, previousGroupMessages, fromUser, deletedTo, toGroup, message, createdIn)
            }
                           
        })
    }

    
}

// ||| NOTE: Deve ser definido a seguinte ação: Quando não houver um usuário y (user1) e x (user2) deve-se apagar as previous messages desta sala e, é claro, o nome dela. |||
const sendMsgController = new SendMsgController();

export {sendMsgController};

/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3. OK
    (FALTA M3)

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usuário que entrar vai passar por esse Map[]. OK 
   
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. E em seguida envia também para user1 dizendo que o user2 se conectou, além disso envia o novo nome do canal entre user1 e user2. User1 muda o enderaçamento do canal para `randomNumber2 + friendName + El + userSoul + randomNumber2`, then, m2 pega as msgs já enviadas por user1 e guardadas com m3, e envia para user2.
            
*/