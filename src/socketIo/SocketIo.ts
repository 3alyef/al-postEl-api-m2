import { Server as Io, Socket } from "socket.io";
import { router as socketIoRoutes } from "./routes/Routes";
import { Server as ServerHTTP } from 'http';
import { TokenValidate } from "./services/Services";
const jwt = require("jsonwebtoken");

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;
}

abstract class SocketIo{
    private socketIo: Io;
    private tokenKey: string;

    private userSocketMap: Map<string, Socket[]>; 

    private userRoomMap: Map<string, string[]>;

    constructor( server: ServerHTTP ){     
        this.userRoomMap = new Map<string, string[]>();
        this.userSocketMap = new Map<string, Socket[]>();
        this.socketIo = new Io( server, {
            cors: {
                origin: "*", // Configurando o CORS para o Socket.IO
                methods: ["GET", "POST"], // Métodos permitidos
                credentials: true // Habilitando o envio de credenciais (por exemplo, cookies)
            }
        });
        this.tokenKey = process.env.TOKEN_KEY || "need key";
        this.setupSocketIo();
    }

    private setupSocketIo(){     
        this.socketIo.on("connection", (socket: Socket)=> {
            console.log("novo usuário")
            const token: string = socket.handshake.headers.authorization || ""; // pega o token

            const {decoded, error} = new TokenValidate().tokenValidate(token);
            // Descriptografa o token e verifica a validade
            if(decoded){
                const userSoul = decoded.userSoul;

                let sockets: Socket[] | undefined = this.userSocketMap.get(userSoul);
                if(!sockets){
                    // Se não existir, inicialize um novo array
                    sockets = [];
                    this.userSocketMap.set(userSoul, sockets);

                }
                // Adicione o socket atual ao array de sockets
                sockets.push(socket); 

                socket.on('disconnect', () => {
                    // Remove a entrada do mapeamento quando o usuário se desconect
                    const index = sockets.indexOf(socket); // Procura o index do socket que está saindo
                    if (index !== -1) { // !== -1 quer dizer que existe
                        sockets.splice(index, 1);
                        console.log('Socket removido do array de sockets.');
                    }

                    // Se não houver mais sockets associados ao soulName, remova o soulName do mapeamento
                    if (sockets.length === 0) {
                        this.userSocketMap.delete(userSoul);
                        console.log(`SoulName ${userSoul} removido do mapeamento.`);
                    }
                });
            }
            
            if(error){ 
                // Se o token for válido o user tem acesso as outras salas se não a conexão é encerrada
                const {status, message} = error;
                console.error('Erro de autenticação:', error.message);

                socket.emit('auth_error', { message, status });
                socket.once('disconnect', () => {
                    console.log('Cliente desconectado após erro de autenticação');
                });
                
                socket.disconnect(true); // Desconecta o usuário
                
            } else {
                console.log(decoded);
                if( decoded?.userSoul ){
                    socketIoRoutes( socket, this.socketIo, this.userRoomMap, decoded, this.userSocketMap ); 
                    // Envia para o routes.ts 
                }        
            }
            
        }) 
    }

}


export default SocketIo;

/* O userRoomMap será responsável por guardar as informações da sala, será mais ou menos assim:
    ==> [roomName1=>[[userSoul1],[userSoul2]], roomName2=>[[userSoul1],[userSoul2]]]; Assim só ingressa na sala quem tem o mesmo userSoul já pre preenchido
*/