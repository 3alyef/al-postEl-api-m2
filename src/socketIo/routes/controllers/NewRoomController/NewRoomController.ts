import { Socket } from "socket.io";
import { msgsRequest, msgsResponse } from "../../../interfaces/msgs.interface";

// friendName is the same than userSoul, but is from user's friend.

class NewRoomController {
    private URL_M3: string;
    constructor(){
        this.URL_M3 = process.env.URL_M3 || "need url"
    }


    newRoom(socket: Socket, routeName: string, userSocketMap:Map<string, Socket[]>, roomsExpectUsers: Map<string, string[]>, previousMessages: Map<string, msgsResponse[]>){ 

        socket.on(routeName, async ({friendName}: {friendName: string})=>{
            const decoded = socket.auth;
            const userName = decoded.userSoul;

            try{
                if(friendName === userName){ 
                    const error = "O email de origem não pode ser igual ao email de destino!";

                    socket.emit(routeName, error);
                    throw new Error(error);
                };

                const socketsFromFriend = userSocketMap.get(friendName);

                const socketsFromUser = userSocketMap.get(userName);

                const roomName: string = this.roomNameGenerate(userName, friendName);

                // Agora deve-se certificar se já há mensagens entre x (user1) e y (user2)
                
                const previous_messages: msgsResponse[] | null = await this.previousMsgs(userName, friendName);

                if(previous_messages){
                    this.usersNotificate(socketsFromUser, socketsFromFriend,  routeName, roomName, previous_messages);
                    this.keepPrevMsgs(previous_messages, previousMessages, roomName);
                }

                this.setExpectUsers(roomsExpectUsers, userName, friendName, roomName)

                this.usersNotificate(socketsFromUser, socketsFromFriend,  routeName, roomName);        
                
            } catch(error){
                console.log(error)
            }
            
        })
        
    }

    private roomNameGenerate(userName: string, friendName: string): string{
        const randomRoomNumber1 = Math.floor(Math.random() * 101); 

        const randomRoomNumber2 = Math.floor(Math.random() * 101); 

        const roomName = `${randomRoomNumber1}${friendName}El${userName}${randomRoomNumber2}`;

        return roomName
    }

    private async previousMsgs(userA: string, userB:string): Promise<msgsResponse[] | null>{
        const body:msgsRequest = {userA, userB};
        try {
            const response = await fetch(`${this.URL_M3}/previousMsgs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });  
            const data: msgsResponse[] = await response.json();
            
            return data || null;
        } catch(error) {
            throw new Error("Error fetching previous messages:"+error);      
        }
    }

    private setExpectUsers( roomsExpectUsers: Map<string, string[]>, userName:string, friendName: string, roomName: string ){

        // Adiciona o friedName na "lista de espera" para quando o usuario sair e entrar novamente as menssagens possam ser carregadas e reenviadas

        const _friendList = roomsExpectUsers.get(friendName);

        if(!_friendList){
            roomsExpectUsers.set(friendName, [roomName]);
        }
        _friendList?.push(roomName);

        // Adiciona também o fromUser na lista

        const _userList = roomsExpectUsers.get(userName);

        if(!_userList){
            roomsExpectUsers.set(userName, [roomName]);
        }
        _userList?.push(roomName);
    }

    private usersNotificate(socketsUser: Socket[] | undefined, socketsFriend: Socket[] | undefined,  routeName: string, roomName: string, messages?: msgsResponse[]){

        if(socketsFriend){
            // Inclui todas as instâncias de friendSocket
            socketsFriend.forEach((socketElement)=>{
            
                // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"
                if(messages){
                    messages.forEach((e)=>{
                        socketElement.emit(routeName,
                            {fromUser: e.fromUser, toUser: e.toUser, message: e.msgs, createdIn: e.createdIn})
                    })
                } else {
                    socketElement.emit(routeName, `Nova sala: ${roomName}`);
                    socketElement.join(roomName);
                }
                       
            })

            //console.log(io.sockets.adapter.rooms)
        } 
            
        // Inclui todas as instâncias de fromUser a roomName
        socketsUser?.forEach((socketElement)=>{
            
            // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"
            
            if(messages){
                messages.forEach((e)=>{
                    socketElement.emit(routeName,
                        {fromUser: e.fromUser, toUser: e.toUser, message: e.msgs, createdIn: e.createdIn})
                })
            } else {
                socketElement.emit(routeName, `Nova sala: ${roomName}`);
                socketElement.join(roomName);
            }
            
            
        });

    }

    private keepPrevMsgs(msgsList: msgsResponse[], previousMessages: Map<string, msgsResponse[]>, roomName: string){
        msgsList.forEach((e)=>{
            const dateInf = new Date(); 
            const data = dateInf.toISOString();
            const msgs: msgsResponse = {
                fromUser: e.fromUser,
                toUser: e.toUser,
                msgs: e.msgs, 
                createdIn: data
            }
            const roomObj = previousMessages.get(roomName);
            if(!roomObj){
                const roomObj: msgsResponse[] = [];
                previousMessages.set(roomName, roomObj);
            }
            roomObj?.push(msgs);
        })
    }
    
}

const newRoomController = new NewRoomController()

export { newRoomController };


/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usuário que entrar vai passar por esse Map[].     
  
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. 
    ||E em seguida envia também para user1 dizendo que o user2 se   conectou|| => Futura revisão
            
*/
