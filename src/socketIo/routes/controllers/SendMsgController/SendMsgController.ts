import { Server as Io, Socket } from "socket.io";
import { msgsResponse, sendMsg } from "../../../interfaces/msgs.interface";
import { SendGroupMsg, SendMsg } from "../../../services/Services";
import { msgsGroupDB } from "../../../interfaces/group.interface";
import { PropsReqUp } from "../../../../m3_server/services/UpdateGroupMsgStatus/UpdateGroupMsgStatus.service";

/* 
    NOTE: Todas as mensagens enviadas do tipo user1 => user2 são direcionadas à um channel especifico criado a partir da rendomização de 2 numbers + soulName1 + soulName2
*/

interface msgSeenUpdateGroupType {
    socket: Socket,
    routeName: string, 
    previousGroupMessages: Map<string, msgsGroupDB[]>,
    userSocketMap:Map<string, Socket[]>,
}
interface status {
    fromUser: string;
    room: string;
    createdIn: string;
}
export interface msgStatus extends status{
    toUser: string;
    viewStatus: "onServer" | "delivered" | "seen";
}

export interface msgStatusGroup extends status{
    toUsers: string[];
    viewStatus: string;
}

class SendMsgController {
    sendMsg(
        io:Io,
        socket: Socket,
        routeName: string, 
        previousMessages: Map<string, msgsResponse[]>,
        userSocketMap:Map<string, Socket[]>
    ){
        socket.on(routeName, async ({fromUser, deletedTo, toUser, toRoom, message, isGroup, chatName, toGroup, createdIn }: sendMsg)=>{ 
            
            if(!isGroup && toRoom){
                
                await new SendMsg().initialize({io, socket,previousMessages, fromUser, deletedTo, toUser, toRoom, message, createdIn, userSocketMap})
            }
                           
        })
    }

    sendGroupMsg(
        io:Io,
        socket: Socket,
        routeName: string, 
        previousGroupMessages: Map<string, msgsGroupDB[]>,
        userSocketMap:Map<string, Socket[]>
    ){
        socket.on(routeName, async (data: msgsGroupDB)=>{ 
            console.log("new group MSG", data)
            await new SendGroupMsg().initialize(io, socket, previousGroupMessages, data, userSocketMap);
        })
    }

    msgSeenUpdate(
        socket: Socket,
        routeName: string, 
        previousMessages: Map<string, msgsResponse[]>,
        userSocketMap:Map<string, Socket[]>,
    ){
        socket.on(routeName, async ({fromUser, toUser, room, viewStatus, createdIn }: msgStatus)=>{
            const msgs = previousMessages.get(room);
            //console.log('msgSeenUpdate', {fromUser, toUser, room, viewStatus, createdIn });
            
            if(msgs){
                const updatedMsgs = msgs.map((msg) => {
                    if (msg.createdIn === createdIn) {
                        return { ...msg, viewStatus };
                    }
                    return msg;
                });
                previousMessages.set(room, updatedMsgs);
                await this.msgUpdateDuo({fromUser, toUser, createdIn, viewStatus})
                const userFromSockets = userSocketMap.get(fromUser)
                if(userFromSockets){
                    userFromSockets.forEach((socket: Socket)=>{
                        socket.emit('msgStatus', {fromUser, room, createdIn, viewStatus, toUser})
                    })
                }
            }


        })
    }

    private async msgUpdateDuo({fromUser, toUser, createdIn, viewStatus}: {fromUser: string, toUser: string, createdIn: string, viewStatus: string}){
        try {
            const body = JSON.stringify({fromUser, toUser, viewStatus, createdIn});
            const response = await fetch(`${process.env.URL_M3}/statusMsgUpdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            console.log('atualizacao msg', response)
        } catch(erro){
            console.log(erro)
        }
    }

    public async setTypingState(
        io:Io,
        socket: Socket,
        routeName: string, 
        previousMessages: Map<string, msgsResponse[]>,
        userSocketMap:Map<string, Socket[]>,
    ) {
        socket.on(routeName, ({state, userSoulFrom, userSoulTo}:{state: boolean, userSoulFrom: string, userSoulTo: string})=>{
            const socketsFriend = userSocketMap.get(userSoulTo);
            console.log({state, userSoulFrom, userSoulTo})
            if(socketsFriend){
                socketsFriend.forEach((socket: Socket)=>{
                    socket.emit('setTypingState', {state, userSoulFrom})
                })
            }
        })
    }

    public msgSeenUpdateGroup(
        {
            socket,
            routeName, 
            previousGroupMessages,
            userSocketMap,
        }: msgSeenUpdateGroupType
    ) {
        socket.on(routeName, async ({createdIn, fromUser, room, toUsers, viewStatus}: msgStatusGroup)=>{
            //console.log("hine STATUS", routeName);
            const previousMsgs = previousGroupMessages.get(room);
            
            if(previousMsgs) {
                const updateMsgs = previousMsgs.map((msg)=>{
                    if(msg.createdIn === createdIn){
                        return {...msg, viewStatus}
                    }
                    return msg;
                })
                previousGroupMessages.set(room, updateMsgs);

                await this.msgGroupUpdateDB({createdIn, fromUser, toUsers, viewStatus});

                const userFromSockets = userSocketMap.get(fromUser)
                if(userFromSockets){
                    userFromSockets.forEach((socketUs: Socket)=>{
                        socketUs.emit('msgGroupStatus', { toGroup: room, createdIn, viewStatus});
                    })
                }
                // atualizará para todos os usuarios
                toUsers.forEach((user)=>{
                    let userSockets = userSocketMap.get(user);
                    if(userSockets){
                        userSockets.forEach((socketUs: Socket)=>{
                            socketUs.emit('msgGroupStatus', { toGroup: room, createdIn, viewStatus});
                        })
                    }
                })
            }
            
        })
    }

    private async msgGroupUpdateDB(msgData: PropsReqUp) {
        try {
            let body = JSON.stringify(msgData)
            let response = await fetch(`${process.env.URL_M3}/statusGroupMsgUpdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            console.log('atualizacao msg', response)
        } catch(error) {
            console.error(error)
        }
    }
    
}
const sendMsgController = new SendMsgController();

export {sendMsgController};

/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3. OK
    (FALTA M3)

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usuário que entrar vai passar por esse Map[]. OK 
   
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. E em seguida envia também para user1 dizendo que o user2 se conectou, além disso envia o novo nome do canal entre user1 e user2. User1 muda o enderaçamento do canal para `randomNumber2 + friendName + El + userSoul + randomNumber2`, then, m2 pega as msgs já enviadas por user1 e guardadas com m3, e envia para user2.
            
*/