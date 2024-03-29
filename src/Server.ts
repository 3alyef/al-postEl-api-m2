// const express = require("express");
import express, { Request, Response } from "express";
import { router } from "./Routes/Routes";
import { routerSocket } from "./Routes/Routes_Socket_Io";
import { createServer, Server as ServerHTTP } from 'http';
import { Server as Io, Socket } from "socket.io";
const cors = require("cors");
const jwt = require("jsonwebtoken");
class Server {
    
    public app: express.Application;
    public server: ServerHTTP;
    private socketIo: Io;
    private ALLOW: string;
    private TOKEN_KEY: string;
    constructor(){
        this.TOKEN_KEY = process.env.TOKEN_KEY || "need key";
        this.ALLOW = process.env.ACCESS_ALLOW_ORIGIN || "nothing";
        this.app = express();
        this.server = createServer(this.app);    
        this.jsonParse();
        this.cors();
        this.routes();
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*" // Por enquanto, tenho ainda que configurar a origin
            }
        });
        this.setupSocketIo();
    }

    private jsonParse(): void {
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private cors(): void {
        this.app.use((req: Request, res: Response, next)=>{

            res.header("Access-Control-Allow-Origin", "*"/*this.ALLOW*/ );
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            this.app.use(cors());
            next();
        })
    }

    private routes(): void {
        this.app.use(router);
    }

    private setupSocketIo(){     
        this.socketIo.on("connection", (socket: Socket)=> {
            const token: string = socket.handshake.headers.authorization || "";// pega o token 
            const {decoded, error} = this.tokenValidate(token); // Ainda precisa solucionar o problema de desconexão automatica do usuario quando já logado e o token expira enquanto está na seção. (talvez não seja necessário mas...)
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
                routerSocket( socket, this.socketIo )
            }
        }) 
    }

    private tokenValidate(token: string): {decoded: any, error: { message: string, status: number} | null }{
        try {
            const decoded = jwt.verify(token, this.TOKEN_KEY);
            return { decoded, error: null };
        } catch (err) {
            const error = { message: 'Autenticação falhou', status: 401 };
            return { decoded: null, error };
        }
    }


}



export { Server };