import { Server as Io, Socket } from "socket.io";
import { router as socketIoRoutes } from "../../socket-io/routes/Routes";
import { Server as ServerHTTP } from 'http';
const jwt = require("jsonwebtoken");

abstract class SocketIo{
    private socketIo: Io;
    private tokenKey: string;
    constructor( server: ServerHTTP ){
          
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
            if(error){ // Se o token for valido o user tem acesso as outras salas se não a conexão é encerrada
                const {status, message} = error;
                console.error('Erro de autenticação:', error.message);
                socket.emit('auth_error', { message, status });
                socket.once('disconnect', () => {
                    console.log('Cliente desconectado após erro de autenticação');
                });
                
                socket.disconnect(true)
                
            } else {
                console.log(decoded)
                socketIoRoutes( socket, this.socketIo )
            }
        }) 
    }

    private tokenValidate(token: string): {decoded: any, error: { message: string, status: number} | null }{
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