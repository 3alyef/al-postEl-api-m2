import { Socket } from "socket.io";
import { msgsResponse } from '../../../interfaces/msgs.interface';
import { AllDataUser, DecodedData } from "../../../interfaces/auth.interface";
import { AddToNetworkList, findDataUser, roomNameGenerate } from "../../../services/Services";

// friendName is the same than userSoul, but is from user's friend.

class CreateConnectionController {
    newConnection(socket: Socket, routeName: string, userSocketMap:Map<string, Socket[]>, roomsExpectUsers: Map<string, string[]>, previousMessages: Map<string, msgsResponse[]>, roomsProps: Map<string, AllDataUser[]>){ 
        socket.on(routeName, async ({friendName}: {friendName: string})=>{
            try {
                const decoded: DecodedData = socket.auth;
                if(!(friendName === decoded.userSoul)){
                    const sockets_user = userSocketMap.get(decoded.userSoul);
                    const sockets_friend = userSocketMap.get(friendName)
                    // TODO: Agora deve-se adicionar à lista de network user e friend
                    
                    new AddToNetworkList().initialize(decoded.userSoul, friendName);
                    //console.log(sockets_user=== sockets)

                    const room = roomNameGenerate(decoded.userSoul, friendName, roomsExpectUsers);
                    let _userList = roomsExpectUsers.get(decoded.userSoul);
                
                    if(!_userList){
                        _userList = []
                        roomsExpectUsers.set(decoded.userSoul, _userList);
                    }
                    _userList?.push(room);
                    

                    let _friendList = roomsExpectUsers.get(friendName);
                
                    if(!_friendList){
                        _friendList = []
                        roomsExpectUsers.set(friendName, _friendList);
                    } 
                    _friendList?.push(room);
                    /*console.log('----------------------------')
                    console.log("friendName", friendName)        
                    console.log("userName", decoded.userSoul)
                    console.log('----------------------------')*/
                    const AllDataAboutFriend: AllDataUser = await findDataUser(friendName)
                
                    const AllDataAboutUser: AllDataUser = await findDataUser(decoded.userSoul)

                    // ROOM PROPS
                    if(!roomsProps.has(room)) {
                        roomsProps.set(room, []);
                    }

                    roomsProps.get(room)?.push(AllDataAboutFriend);
                    roomsProps.get(room)?.push(AllDataAboutUser);
                    //
                    console.log("AllDataAboutFriend", AllDataAboutFriend)
                    console.log("AllDataAboutUser", AllDataAboutUser)
                
                    if(sockets_user){
                        sockets_user.forEach((socketElement) => {
                            socketElement.join(room);
                            // Envia a mensagem para todos os /'nicknames" que detenham o mesmo soulName
                            //socketElement.emit(routeName ,`${friendName}`);
                            
                            // AQUI, VOCE PRECISA BUSCAR OS DADOS DO USUARIO NO DATABASE E COLOCAR NO FRIENDDATA
                            console.log(AllDataAboutFriend)
                            socketElement.emit("updateAll", {message: "add_room", content:room, friendData: AllDataAboutFriend})
                            
                    });

                    if(sockets_friend){
                        sockets_friend.forEach((socketElement) => {
                            // Envia a mensagem para todos os /'nicknames" que detenham o mesmo soulName
                            socketElement.join(room);
                            //socketElement.emit(routeName ,`${friendName}`);
                            console.log(AllDataAboutUser)
                            socketElement.emit("updateAll", {message: "add_room", content: room, friendData: AllDataAboutUser})
                            
                    });
                    
                    }     
                }
                }
            } catch(error){
                console.error("Erro ao criar conexão: "+ error)
                socket.emit(`${routeName}Error`, `Erro ao criar conexão: ${error}`)
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
