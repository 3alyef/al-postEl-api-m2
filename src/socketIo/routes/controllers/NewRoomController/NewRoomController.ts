import { Socket, Server } from "socket.io";

// friendName is the same than userSoul, but is from user's friend.

class NewRoomController {
    newRoom(
        socket: Socket, 
        io: Server, 
        routeName: string, 
        userSocketMap:Map<string, Socket[]>
        ){ 

        socket.on(routeName, async ({friendName}: {friendName: string})=>{
            // 1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.
            const decoded = socket.auth;
            const fromUser = decoded.userSoul;
            
            const socketsFromFriend = userSocketMap.get(friendName);
            const socketsFromUser = userSocketMap.get(fromUser);
            if(socketsFromFriend){
                //console.log(socketsFromFriend, socketsFromUser)
                const randomRoomNumber1 = Math.floor(Math.random() * 101); // Gera um número entre 0 e 100

                const randomRoomNumber2 = Math.floor(Math.random() * 101); // Gera um número entre 0 e 100

                const roomName = `${randomRoomNumber1}${friendName}El${fromUser}${randomRoomNumber2}`;

                console.log(io.sockets.adapter.rooms)
     

                // Inclui todas as instâncias de fromUser a roomName
                socketsFromUser?.forEach((socketElement)=>{
                    
                    // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"
                    
                    socketElement.emit(routeName, `Nova sala: ${roomName}`);
                    socketElement.leave(routeName);
                    socketElement.join(roomName);
                    
                })

                // Inclui todas as instâncias de friendSocket
                socketsFromFriend.forEach((socketElement)=>{
                    
      
                    // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"
                    
                    socketElement.emit(routeName, `Nova sala: ${roomName}`);
                    socketElement.leave(routeName);
                    socketElement.join(roomName);
                       
                })

                console.log(io.sockets.adapter.rooms)
            } else {
                // Em caso o user2 não estiver online
            }
        })

        
    }
    private async consultarServidorM3(roomName: string): Promise<boolean>{
        return false
    }
}

const newRoomController = new NewRoomController()

export { newRoomController };


/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usário que entrar vai passar por esse Map[].     
    => Note: As mensagens enviadas por user1 serão enviadas por meio do canal `${soulNameUser1}+El`.
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. E em seguida envia também para user1 dizendo que o user2 se conectou, além disso envia o novo nome do canal entre user1 e user2. User1 muda o enderaçamento do canal para `randomNumber2 + friendName + El + userSoul + randomNumber2`, then, m2 pega as msgs já enviadas por user1 e guardadas com m3, e envia para user2.
            
*/
