// const express = require("express");
import express, { Request, Response } from "express";
import { router } from "./Routes/Routes";
import { createServer, Server as ServerHTTP } from 'http';
import { Server as Io } from "socket.io";
const cors = require("cors");
class Server {
    
    public app: express.Application;
    public server: ServerHTTP;
    private socketIo: Io;
    private ALLOW: string;
    constructor(){
        this.ALLOW = process.env.ACCESS_ALLOW_ORIGIN || "nothing";
        this.app = express();
        this.server = createServer(this.app);
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*" // Por enquanto, tenho ainda que configurar a origin
            }
        });
        this.jsonParse();
        this.cors();
        this.routes();
    }

    private jsonParse(): void {
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private cors(): void {
        this.app.use((req: Request, res: Response, next)=>{

            res.header("Access-Control-Allow-Origin", this.ALLOW );
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            this.app.use(cors());
            next();
        })
    }

    private routes(): void {
        this.app.use(router);
    }

}



export { Server };