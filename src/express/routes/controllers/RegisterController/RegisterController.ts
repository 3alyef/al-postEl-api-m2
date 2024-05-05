import { Request, Response } from "express";
import { Register } from "../../../services/Services";

class RegisterController {
    postRegister(req: Request, res: Response){
        // res.send("Você está tentando registrar-se!, bem vamos começar!");
        new Register().initialize(req, res);
    }
}


const registerController = new RegisterController();

export { registerController };