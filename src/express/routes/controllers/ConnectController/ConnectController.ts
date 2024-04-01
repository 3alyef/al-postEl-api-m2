import { Request, Response } from "express";
import { Connect } from "../../../services/Services"
class ConnectCollection {
    postConnect(req: Request, res: Response) {
        // res.send('Você está tentando fazer login! Bem, vamos começar!')
        new Connect().initialize(req, res);

    }
}

const connectCollection = new ConnectCollection();
export { connectCollection };