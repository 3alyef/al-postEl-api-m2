import { Socket, Server } from "socket.io";
import { EncryptJWT } from "../../../services/Services"
interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}
// friendName is the same than userSoul, but is from user's friend.

class JoinRoomController {
    private token: string;
    private usersToRoom: string[];
    constructor(){
        this.usersToRoom = []
        this.token = process.env.TOKEN_KEY || "need token";
    }

    joinRoom(
        socket: Socket, 
        io: Server, 
        userRoomMap: Map<string, string[]>, 
        routeName: string, 
        decoded: decodedToken, 
        userSocketMap:Map<string, Socket[]>
        ){ 

        socket.on(routeName, async ({friendName}: {friendName: string})=>{
            // 1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.

           
            const fromUser = decoded.userSoul;
            const socketsFromFriend = userSocketMap.get(friendName);
            const socketsFromUser = userSocketMap.get(fromUser);
            if(socketsFromFriend){
                const randomRoomNumber1 = Math.floor(Math.random() * 101); // Gera um número entre 0 e 100

                const randomRoomNumber2 = Math.floor(Math.random() * 101); // Gera um número entre 0 e 100

                const roomName = `${randomRoomNumber1}${friendName}El${fromUser}${randomRoomNumber2}`;

                // Inclui todas as instâncias de fromUser a roomName
                socketsFromUser?.forEach((socketElement, i)=>{
                    socketElement.join(roomName)

                    // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"

                    socketElement.emit(routeName, `Conectado a uma nova sala nome: ${roomName}`);
                    if( i === 0 ){
                        // Adiciona o userSoul do user em questao
                        this.usersToRoom.push(fromUser);
                        
                    }

                    socketElement.leave(roomName);
                    
                })

                // Inclui todas as instâncias de friendSocket
                socketsFromFriend.forEach((socketElement, i)=>{
                    socketElement.join(roomName)
                    if( i === 0 ){
                        // Adiciona o userSoul do user em questao
                        this.usersToRoom.push(fromUser);
                    }

                    // Enviará uma mensagem: "Connectado a uma nova sala nome: `randomNumber2 + friendName + El + userSoul + randomNumber2`"
                    
                    socketElement.emit(routeName, `Connectado a uma nova sala nome: ${roomName}`);

                    socketElement.leave(roomName);
                       
                })

                const content = new EncryptJWT().TokenGenerator({update: true, roomName, users: this.usersToRoom, token: this.token})

                // It works on this way: SERVER => CLIENT => SERVER
                socket.emit( "updateLinks", content );
             
            } else {
                // Em caso o user2 não estiver online
            }
        })

        
    }
    private async consultarServidorM3(roomName: string): Promise<boolean>{
        return false
    }
}

const joinRoomController = new JoinRoomController()

export { joinRoomController };


/*
            || Como funcionará o envio de mensagens ||

    1 - Se o user2 estiver conectado ele vai criar uma sala com `randomNumber2 + friendName + El + userSoul + randomNumber2`, enviando a mensagem em seguida para a sala e depois para M3.

    2 - Se o user2 não estiver conectado o M2 vai enviar as mensagens para M3. Deve-se criar um Map[] com "usuários esperados", todo usário que entrar vai passar por esse Map[].     
    => Note: As mensagens enviadas por user1 serão enviadas por meio do canal `${soulNameUser1}+El`.
    
    3 - Quando o user2 se conectar, se o userSoul dele (friendName) estiver na lista, ele já coloca este usuário na sala e avisa-o no canal reservado (que todo user tem userSoul) que uma nova sala foi criada e envia o nameRoom. E em seguida envia também para user1 dizendo que o user2 se conectou, além disso envia o novo nome do canal entre user1 e user2. User1 muda o enderaçamento do canal para `randomNumber2 + friendName + El + userSoul + randomNumber2`, then, m2 pega as msgs já enviadas por user1 e guardadas com m3, e envia para user2.
            
*/
