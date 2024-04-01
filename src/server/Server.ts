import express, { Request, Response } from "express";

import { router as expressRoutes } from "../express/routes/Routes";
import { router as socketIoRoutes } from "../socket-io/routes/Routes";


import { createServer, Server as ServerHTTP } from 'http';
import { Server as Io, Socket } from "socket.io";
const cors = require("cors");
const jwt = require("jsonwebtoken");

class Server {
    
    public app: express.Application;
    public server: ServerHTTP;
    private socketIo: Io;
    private ALLOW: string;
    private tokenKey: string;
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY || "need key";
        this.ALLOW = process.env.ACCESS_ALLOW_ORIGIN || "http://localhost:8282";
        this.app = express();
        this.server = createServer(this.app);    
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*", // Configurando o CORS para o Socket.IO
                methods: ["GET", "POST"], // Métodos permitidos
                credentials: true // Habilitando o envio de credenciais (por exemplo, cookies)
            }
        });
        this.jsonParse();
        this.setupCors();
        this.routes(); 
        this.setupSocketIo();
    }

    private jsonParse(): void {
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private setupCors(): void {
        this.app.use((req: Request, res: Response, next)=>{

            res.header("Access-Control-Allow-Origin", this.ALLOW );
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            this.app.use(cors());
            next();
        })
    }

    private routes(): void {
        this.app.use(expressRoutes);
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



export { Server };