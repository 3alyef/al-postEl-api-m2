import { Socket } from "socket.io";
import { msgsResponse } from '../../../interfaces/msgs.interface';
import { DecodedData } from "../../../interfaces/auth.interface";
import { AddToNetworkList, roomNameGenerate } from "../../../services/Services";

// friendName is the same than userSoul, but is from user's friend.

class CreateConnectionController {
    newConnection(socket: Socket, routeName: string, userSocketMap:Map<string, Socket[]>, roomsExpectUsers: Map<string, string[]>, previousMessages: Map<string, msgsResponse[]>){ 
        socket.on(routeName, async ({friendName}: {friendName: string})=>{
            try {
                const decoded: DecodedData = socket.auth;
                if(!(friendName === decoded.userSoul)){
                    const sockets_user = userSocketMap.get(decoded.userSoul);
                    const sockets_friend = userSocketMap.get(friendName)
                    // TODO: Agora deve-se adicionar à lista de network user e friend
                    
                    new AddToNetworkList().initialize(decoded.userSoul, friendName);
                

                    const room = roomNameGenerate(decoded.userSoul, friendName, roomsExpectUsers);
                    const _userList = roomsExpectUsers.get(decoded.userSoul);
                
                    if(!_userList){
                        roomsExpectUsers.set(decoded.userSoul, [room]);
                    } else {
                        _userList?.push(room);
                    }

                    const _friendList = roomsExpectUsers.get(friendName);
                
                    if(!_friendList){
                        roomsExpectUsers.set(friendName, [room]);
                    } else {
                        _friendList?.push(room);
                    }                    
                
                
                    if(sockets_user){
                        sockets_user.forEach((socketElement) => {
                            socketElement.join(room);
                            // Envia a mensagem para todos os /'nicknames" que detenham o mesmo soulName
                            socketElement.emit(routeName ,`${friendName}`);
                            socket.emit("updateAll", `Você foi adicionado na sala: ${room}`)
                            
                    });

                    if(sockets_friend){
                        sockets_friend.forEach((socketElement) => {
                            // Envia a mensagem para todos os /'nicknames" que detenham o mesmo soulName
                            socketElement.join(room);
                            socketElement.emit(routeName ,`${friendName}`);
                            socket.emit("updateAll", `Você foi adicionado na sala: ${room}`)
                            
                    });
                    
                    }     
                }
                }
            } catch(error){
                console.error("Erro ao criar conexão: "+ error)
            } 

        })
        
    }

    
    
}

const createConnectionController = new CreateConnectionController()

export { createConnectionController };


/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usuário que entrar vai passar por esse Map[].     
  
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. 
    ||E em seguida envia também para user1 dizendo que o user2 se   conectou|| => Futura revisão
            
*/
