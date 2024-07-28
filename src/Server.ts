import express, { Application } from "express";

import { router as expressRoutes } from "./express/routes/Routes";
import SocketIo from "./socketIo/SocketIo"; // Class que cuidará das regras de SocketIo

import { createServer } from 'http';

import { Server as ServerHTTP } from 'http';
import router from "./m3_server/routes/Routes";
const cors = require("cors");


import { createServer as createServerHTTPS } from 'https'; // Import para criar servidor HTTPS
import * as fs from 'fs'; // Import para ler os arquivos de certificado

class Server extends SocketIo {
    private app: Application;
    private ALLOW: string;
    public server: ServerHTTP;
    private ALLOW_ALPOSTEL: string;
    constructor(){
        const app = express();     
        const server = createServer(app);  

        // Configuração do servidor HTTPS
        /*const options = {
            key: fs.readFileSync('../ssl/ssl_key.pem'),
            cert: fs.readFileSync('../ssl_cert/ssl.pem')
        };
        const server = createServerHTTPS(options, app);  */

        super( server );
        this.server = server;
        this.app = app;  
        this.ALLOW = process.env.URL_M1 || "http://localhost:8282";
        this.ALLOW_ALPOSTEL = process.env.URL_ALPOSTEL || "http://localhost:3000";    
        this.jsonParse();
        this.setupCors();
        this.routes(); 
        this.routesM3();
    }

    private jsonParse(): void {
        // Adiciona o middleware express.json() para fazer o parse do corpo da requisição
        this.app.use(express.json());
    };

    private setupCors(): void {

        this.app.use(cors({
            origin: [this.ALLOW, this.ALLOW_ALPOSTEL],
            methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }));
    }

    private routes(): void {
        this.app.use(expressRoutes);
    }

    private routesM3(): void {
        this.app.use(router);
    }
}



export { Server };