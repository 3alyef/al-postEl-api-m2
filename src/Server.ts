import express, { Request, Response, Application } from "express";

import { router as expressRoutes } from "./express/routes/Routes";

import SocketIo from "./socketIo/SocketIo"; // Class que cuidará das regras de SocketIo

import { createServer } from 'http';

import { Server as ServerHTTP } from 'http';
const cors = require("cors");

class Server extends SocketIo {
    private app: Application;
    private ALLOW: string;
    public server: ServerHTTP;
    constructor(){
        const app = express();     
        const server = createServer(app);  
        super( server );
        this.server = server;
        this.app = app;  
        this.ALLOW = process.env.ACCESS_ALLOW_ORIGIN || "http://localhost:8282";    
        this.jsonParse();
        this.setupCors();
        this.routes(); 
     
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

}



export { Server };