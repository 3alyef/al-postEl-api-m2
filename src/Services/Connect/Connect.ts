import { Request, Response } from "express";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
class Connect {
    public async initialize(req: Request, res: Response ) {
        const { idC, emailC, soulNameC } = req.body;
        const KEY = process.env.KEY || "test";
        
        const iv = Buffer.alloc(16);    
        
        const { id, email, soulName } = this.getDecryptKeys(idC, emailC, soulNameC, KEY, iv); // enviar para soketIo e M3

        const token = this.TokenGenerator( id, soulName ); // gera o token


        return res.status(200).json({ auth: true, token }).end()
  
    }

    private getDecryptKeys( idC: string, soulNameC: string, emailC: string, KEY: string, iv: Buffer ): { id: string, email: string, soulName: string } {

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
        const TOKEN_KEY = process.env.TOKEN_KEY;
        // 1800 30min
        const token = jwt.sign({userId, userSoul}, TOKEN_KEY, { expiresIn: 60 })

        return token 
    }
}

export { Connect }