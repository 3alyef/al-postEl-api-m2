import { Request, response, Response } from "express";
import { dataUserModel, userModel } from "../../db/models/Models";
const crypto = require('crypto');
import { validateCredentials } from "../Services";
import { CustomError } from "../../interfaces/common.interface";
interface User {
    _id: string;
    soulName: string;
}

export interface costumName {
    custom_name: string | undefined;
    lastUpdateIn: string | undefined
}
class Login {
    private KEY: string;
    private iv: Buffer;
    private URL_M2: string;
    constructor(){
        this.URL_M2 = process.env.URL_M2 || "need M2 URL"
        this.KEY = process.env.KEY || "test";
        this.iv = Buffer.alloc(16); // 256-bit key (32 bytes)    
    }

    public async initialize(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log(email, password)
        try{
            const user: User | null = await this.findUser( email, password );
            
            if(user){             
                const costumName:costumName | null = await findCostumName(user.soulName)
                let costumNC;
                let costumNLUPC;
                let costumNameC: costumName = {custom_name: undefined, lastUpdateIn: undefined};
                if(costumName && costumName.custom_name && costumName.lastUpdateIn){
                    costumNC = this.encryptMessage((costumName.custom_name).toString(), this.KEY, this.iv);

                    costumNLUPC = this.encryptMessage((costumName.lastUpdateIn).toString(), this.KEY, this.iv);
                    costumNameC = {custom_name: costumNC, lastUpdateIn: costumNLUPC}
                }
                const idC = this.encryptMessage((user._id).toString(), this.KEY, this.iv);
                const soulNameC = this.encryptMessage(user.soulName, this.KEY, this.iv);
                const emailC = this.encryptMessage(email, this.KEY, this.iv);
              
                const m2_res = await this.getToken( idC, soulNameC, emailC, costumNameC );
                if("message" in m2_res){
                    throw {status: 500, message: m2_res.message}
                } else {
                    res.status(200).json({ auth: m2_res.auth, token: m2_res.token , URL_M2: this.URL_M2 });
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
                
      
    } // validates email and password credentials in the database

    private encryptMessage(message: string, key: string, iv: Buffer): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(message, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        if(!encrypted){
            throw {message: "Error encrypting data.", status: 500}
        }
        return encrypted;
    
    } 

    private async getToken(idC: string, soulNameC: string, emailC: string, costumNameC: costumName): Promise<{ auth: boolean, token: string} | {message: string}> {
        try {
            const body = JSON.stringify({ idC, soulNameC, emailC, costumNameC });
            console.log(body)
            const response = await fetch(`${this.URL_M2}/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            // console.log(response)
            if (!response.ok) {
                throw {message: response.statusText}
            }  
            return await response.json();
        } catch (error) {
            const err = error as CustomError
            console.error('Error connecting to M2:', err.message);
            return { message: err.message }
        }
    }    
}

export async function findCostumName(soulName: string): Promise<costumName | null>{
    const userCustom: costumName | null = await dataUserModel.findOne({ soulName }, 'custom_name lastUpdateIn');

    if (userCustom) {
        // Returns an object containing the _id and soulName of the user
        console.log(userCustom)
        return { custom_name: userCustom.custom_name, lastUpdateIn: userCustom.lastUpdateIn };
    } else {
        // Returns null if no user is found
        return null;
    }
}
export { Login };
