import { Request, Response } from "express";
import { Connect } from "../../../Services/Services"
class ConnectCollection {
    postLogin(req: Request, res: Response) {
        // res.send('Você está tentando fazer login! Bem, vamos começar!')
        new Connect().initialize(req, res);

    }
}

const loginCollection = new ConnectCollection();
export { loginCollection };