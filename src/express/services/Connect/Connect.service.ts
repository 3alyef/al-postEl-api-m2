import { Request, Response } from "express";
import { costumName, requestEncrypt } from "../../interfaces/request.interface";
import { requestDecrypt } from "../../interfaces/requestDecrypt.interface";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class Connect {
    private SECURE: string;
    private iv: Buffer;
    private tokenKey: string;

    constructor(){
        this.SECURE = process.env.KEY || "need secure key";
        this.iv = Buffer.alloc(16);
        this.tokenKey = process.env.TOKEN_KEY || "token key";
    }
  
    public async initialize(req: Request, res: Response ) {
        try {
            const { idC, emailC, soulNameC, costumNameC }: requestEncrypt = req.body;
            console.log(req.body)
            const { id, email, soulName, costumName } = this.getDecryptKeys(idC, emailC, soulNameC, costumNameC, this.SECURE, this.iv); // Send to socket.io and M3

            const token = this.TokenGenerator( id, soulName, email, costumName ); // Generates the token

            return res.status(200).json({ auth: true, token, email }).end();
        } catch(error) {
            console.log("Error authenticating user credentials: "+error);
            return res.status(500).json({ auth: false }).end();
        }
    }

    private getDecryptKeys( idC: string, emailC: string, soulNameC: string, costumNameC: costumName, KEY: string, iv: Buffer ): requestDecrypt {
        try {
            const id = this.decryptMessage(idC, KEY, iv);
            const soulName = this.decryptMessage(soulNameC, KEY, iv);
            const email = this.decryptMessage(emailC, KEY, iv);

            let costumName:costumName = {custom_name: undefined, lastUpdateIn: undefined}
            if(costumNameC.custom_name && costumNameC.lastUpdateIn){
                const custom_name = this.decryptMessage(costumNameC.custom_name, KEY, iv)
                const lastUpdateIn = this.decryptMessage(costumNameC.lastUpdateIn, KEY, iv)
                costumName = {custom_name, lastUpdateIn}
            }
            
            return { id , email , soulName, costumName}
        } catch(error){
            throw new Error("Error decrypting data from M1: "+error)
        }  
    }

    private decryptMessage(encryptedMessage: string, key: string, iv: Buffer): string {
        try{
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch(error){
            throw new Error("Error decrypting single messages from M1: "+error)
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

export { Connect };
