import { Socket, Server } from "socket.io";
import { TokenValidate } from "../../../services/Services";
interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

class UpdateLinksController {
    private token: string;
    constructor(){
        this.token = process.env.TOKEN_KEY || "need token";
    }
    updateLinks(
        socket: Socket, 
        io: Server, 
        routeName: string, 
        decoded: decodedToken, 
        userRoomMap:Map<string, string[]>     
    ){  /*
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
        socket.on(routeName, ({update, roomName, users, token}: {update: boolean, roomName:string, users: string[], token: string}) => {

            if(update && token === this.token){
                console.log("tentativa de atualização");
                socket.on(roomName, (socket: Socket)=>{
                    const token: string = socket.handshake.headers.authorization || ""; // pega o token

                    const {decoded, error} = new TokenValidate().tokenValidate(token);
                    if(decoded?.userSoul){
                        if(users.includes(decoded?.userSoul)){
                            console.log("Usuário ingressou na sala: "+roomName)
                        }
                    } else {
                        socket.disconnect(true);
                        console.log("token inválido!")
                    }
                })
            }
        });
        
    }

}

const updateLinksController = new UpdateLinksController()
export { updateLinksController };