import { Socket } from "socket.io";
import { msgsResponse, sendMsg } from "../../../interfaces/msgs.interface";
import { SendMsg } from "../../../services/Services";

/* 
    NOTE: Todas as mensagens enviadas do tipo user1 => user2 são direcionadas à um channel especifico criado a partir da rendomização de 2 numbers + soulName1 + soulName2
*/

class SendMsgController {
    sendMsg(
        socket: Socket,
        routeName: string, 
        previousMessages: Map<string, msgsResponse[]>
    ){
        socket.on(routeName, async ({ fromUser, toUser, toRoom, message, isGroup, chatName }: sendMsg)=>{ 
            if(!isGroup){
                await new SendMsg().initialize(socket, routeName, previousMessages, fromUser, toUser, toRoom, message)
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