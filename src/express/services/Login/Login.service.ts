import { Request, response, Response } from "express";
import { dataUserModel, userModel } from "../../db/models/Models";
const crypto = require('crypto');
import { validateCredentials } from "../Services";
import { CustomError } from "../../interfaces/common.interface";
const jwt = require("jsonwebtoken");
interface User {
    _id: string;
    soulName: string;
}

export interface costumName {
    custom_name: string | undefined;
    lastUpdateIn: string | undefined
}
class Login {
    private URL_M2: string;
    private tokenKey: string;
    constructor(){
        this.URL_M2 = process.env.URL_M2 || "need M2 URL"
        this.tokenKey = process.env.TOKEN_KEY || "token key";  
    }

    public async initialize(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log(email, password)
        try{
            const user: User | null = await this.findUser( email, password );
            
            if(user){             
                const costumNameContain:costumName | {custom_name: undefined, lastUpdateIn: undefined} = await findCostumName(user.soulName)

                const token = this.TokenGenerator( user._id, user.soulName, email, costumNameContain );
                if(token){
                    res.status(200).json({ auth: true, token: token , URL_M2: this.URL_M2 });
                } else {
                    throw {status: 500, message: "Erro ao gerar token"}
                }
                
            } else {
                throw {message: "Password do not match!", status: 401}
            }

        } catch( error ){
            const { status, message } = error as CustomError;
            console.error("Error while trying to log in: "+ message);
            res.status(status).json({ message }).end();
        }
    }

    private async findUser(email: string, password: string): Promise<{ _id: string, soulName: string } | null> {   
        
        const {passEncrypt}: { passEncrypt: string } = await validateCredentials(email, password, true);
        const user: User | null = await userModel.findOne({ email: email, password: passEncrypt }, '_id soulName');

        if (user) {
            // Returns an object containing the _id and soulName of the user
            return { _id: user._id, soulName: user.soulName };
        } else {
            // Returns null if no user is found
            return null;
        }         
      
    }  

    private TokenGenerator( userId: string, userSoul: string, email:string, costumName:costumName  ): string {
        try{
            // 1800 => 30min  30 => 0.5min
            const token = jwt.sign( { userId, userSoul, email, costumName }, this.tokenKey, { expiresIn: 7200 })

            return token;
        } catch(error){
            throw new Error("Error generating token: "+ error);
        }  
    }
}

export async function findCostumName(soulName: string): Promise<costumName | {custom_name: undefined, lastUpdateIn: undefined}>{
    const userCustom: costumName | null = await dataUserModel.findOne({ soulName }, 'custom_name lastUpdateIn');

    if (userCustom) {
        // Returns an object containing the _id and soulName of the user
        console.log(userCustom)
        return { custom_name: userCustom.custom_name, lastUpdateIn: userCustom.lastUpdateIn };
    } else {
        // Returns null if no user is found
        return {custom_name: undefined, lastUpdateIn: undefined};
    }
}
export { Login };
