import { Server as Io, Socket } from "socket.io";
import { router as socketIoRoutes } from "./routes/Routes";
import { Server as ServerHTTP } from 'http';
const jwt = require("jsonwebtoken");

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

const userSocketMap = new Map();

abstract class SocketIo{
    private socketIo: Io;
    private tokenKey: string;

    private userSocketMap: Map<string, Socket>; // ||HERE

    constructor( server: ServerHTTP ){     
        this.userSocketMap = new Map();
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

            const token: string = socket.handshake.headers.authorization || ""; // pega o token

            const {decoded, error} = this.tokenValidate(token);
            // Descriptografa o token e verifica a validade

            userSocketMap.set(decoded?.userSoul, socket); // linka o userSoul da pessoa no sitema

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
                if( decoded?.userSoul){
                    socketIoRoutes( socket, this.socketIo, decoded, userSocketMap); // Envia para o routes.ts // ||HERE
                }        
            }

            socket.on('disconnect', () => {
                // Remove a entrada do mapeamento quando o usuário se desconecta
                userSocketMap.delete(token);
            });
        }) 
    }

    private tokenValidate(token: string): {decoded: decodedToken | null, error: { message: string, status: number} | null }{
        try {
            const decoded = jwt.verify(token, this.tokenKey);
            return { decoded, error: null };
        } catch (err) {
            const error = { message: 'Autenticação falhou', status: 401 };
            return { decoded: null, error };
        }
    }

}


export default SocketIo;