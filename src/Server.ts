// const express = require("express");
import express from "express";
import { router } from "./Routes/Routes";
import { createServer, Server as ServerHTTP } from 'http';
import { Server as Io } from "socket.io";
class Server {
    public app: express.Application;
    public server: ServerHTTP;
    private socketIo: Io;
    constructor(){
        this.app = express();
        this.server = createServer(this.app);
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*" // Por enquanto, tenho que ainda configurar a origin
            }
        });
        this.jsonParse();
        this.routes();
    }

    private jsonParse = () =>{
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private routes = ()=> {
        this.app.use(router);
    }

}



export { Server };