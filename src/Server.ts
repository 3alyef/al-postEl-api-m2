// const express = require("express");
import express, { Request, Response } from "express";
import { router } from "./Routes/Routes";
import { createServer, Server as ServerHTTP } from 'http';
import { Server as Io } from "socket.io";
const cors = require('cors');
const ALLOW = process.env.ACESS_ALLOW_ORIGIN
class Server {
    public app: express.Application;
    public server: ServerHTTP;
    private socketIo: Io;
    constructor(){
        this.app = express();
        this.server = createServer(this.app);
        this.socketIo = new Io(this.server, {
            cors: {
                origin: ALLOW // Por enquanto, tenho que ainda configurar a origin
            }
        });
        this.jsonParse();
        this.cors();
        this.routes();
    }

    private jsonParse(){
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private cors(){
        this.app.use((req: Request, res: Response, next)=>{

            res.header("Access-Control-Allow-Origin", ALLOW);
            res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
            this.app.use(cors());
            next();
        })
    }

    private routes(){
        this.app.use(router);
    }

}



export { Server };