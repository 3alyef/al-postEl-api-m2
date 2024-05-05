import { Request, Response } from "express";
import { Login, EmailLogin } from "../../../services/Services"
class LoginController {

   

    postLogin(req: Request, res: Response) {
        // res.send('Você está tentando fazer login! Bem, vamos começar!')
        console.log('passou postLogin')
        new Login().initialize(req, res);
    }
    postEmail(req: Request<{body:{email: string}}>, res: Response) {
        // Vai conferir no database se existe algum email correspondente
        console.log("rota postEmail")
        new EmailLogin().initialize(req, res);
    }
   
}

const loginController = new LoginController();

export { loginController };