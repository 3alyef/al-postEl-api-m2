import { Socket, Server } from "socket.io";
import { TokenValidate } from "../../../services/Services";
type DecodedToken = {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

type Content = {
    update: boolean;
    roomName: string;
    users: string[];
    token: string;
};


class UpdateLinksController {
    private token: string;
    constructor(){
        this.token = process.env.TOKEN_KEY || "need token";
    }
    updateLinks(
        socket: Socket, 
        io: Server, 
        routeName: string, 
        userRoomMap:Map<string, string[]>     
    ){      
        socket.use(([room, content] , next)=>{

            if( room = routeName){
                console.log("sala: ", room)
                console.log("cotent: ", content)
            }
            
            next();
        })
        socket.on(routeName, async (content: { token: string }) => {
            const { decoded, error } = new TokenValidate<Content>().tokenValidate(content.token);
            const data = decoded;
            console.log('tentativa de adicao de sala', io.sockets.adapter.rooms)
            if (data?.roomName) { 
                io.to(data.roomName).emit('shalom')
                console.log("Sala atualizada:", data.roomName);
                
                // Agora que o nome da sala foi atualizado, você pode acessar a sala aqui
                socket.on(data.roomName, (anotherSocket) => {
                    socket.to(data.roomName).emit("Hello")
                    console.log("Oi........")
                    const token: string = socket.handshake.headers.authorization || "";
                    const { decoded, error } = new TokenValidate<DecodedToken>().tokenValidate(token);

                    if (decoded && data.users.includes(decoded.userSoul)) {
                        console.log("Usuário ingressou na sala: " + data.roomName);
                    } else {
                        socket.disconnect(true);
                        console.log("Token inválido!");
                    }
                });

                console.log(io.sockets.adapter.rooms)
            } else {
                console.log("Erro ao receber o nome da sala no evento 'updateLinks'");
            }
        });
    
            
        
    }

   

}

const updateLinksController = new UpdateLinksController()
export { updateLinksController };

/*
        const setupRooms = () => {          
            userRoomMap.forEach((users, roomName) => {       
                socket.on(roomName, () => {
                    if (users.includes(decoded.userSoul)) {
                        socket.on(roomName, ()=>{
                            console.log("usuario logou!")
                        })
                    } else {
                        console.log("Acesso negado!")
                        socket.disconnect();
                    }
                });
            });
        };
                // Configurar quando o M3 estiver em execução...
        setupRooms();
        */