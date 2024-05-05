import { NextFunction, Request, Response } from "express";
import { unregisterRequest } from "../interfaces/unregister.interface";
import { CustomError } from "../interfaces/common.interface";
import { decrypt } from "../services/Decrypt/Decrypt.service";

export async function unregisterMiddleware(req: Request<{ body: unregisterRequest }>, res: Response, next: NextFunction){
    try {
        const SECURE = process.env.KEY || "test";
        const iv = Buffer.alloc(16);
        let { email, password } = req.body;
        console.log("Aqui", email, password)
        let emailD = decrypt(email, SECURE, iv);
        let passwordD = decrypt(password, SECURE, iv);

        if(!emailD || !passwordD || !email || !password){
            throw {message: "Erro ao verificar credênciais", status: 401};
        }
        console.log(emailD, passwordD)
        req.body.email = emailD;
        req.body.password = passwordD;
        next();
    } catch(error){
        const { status, message } = error as CustomError;
        res.status(status || 401).json({message: message || "Usuario não autorizado"}).end();
    }  
}