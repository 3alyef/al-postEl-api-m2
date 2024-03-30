import { Request, Response } from "express";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
class Connect {
    private SECURE: string;
    private iv: Buffer;
    private tokenKey: string;
    constructor(){
        this.SECURE = process.env.KEY || "need secure key"; // chave de criptografia
        this.iv = Buffer.alloc(16); // decryptMethod
        this.tokenKey = process.env.TOKEN_KEY || "token key";// chave de criptografia do token

    }
  
    public async initialize(req: Request, res: Response ) {
        const { idC, emailC, soulNameC } = req.body;
        
        const { id, email, soulName } = this.getDecryptKeys(idC, emailC, soulNameC, this.SECURE, this.iv); // enviar para soketIo e M3


        const token = this.TokenGenerator( id, soulName ); // gera o token


        return res.status(200).json({ auth: true, token, email }).end()
  
    }

    private getDecryptKeys( idC: string, emailC: string, soulNameC: string, KEY: string, iv: Buffer ): { id: string, email: string, soulName: string } {

        const id = this.decryptMessage(idC, KEY, iv);
        const soulName = this.decryptMessage(soulNameC, KEY, iv);
        const email = this.decryptMessage(emailC, KEY, iv);

        return { id , email , soulName }
    }

    private decryptMessage(encryptedMessage: string, key: string, iv: Buffer): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    private TokenGenerator( userId: string, userSoul: string ): {token: string}{
        // 1800 30min
        const token = jwt.sign( { userId, userSoul }, this.tokenKey, { expiresIn: 30 })

        return token;
    }
}

export { Connect }