import { Request, Response } from "express";
const crypto = require("crypto")
class Connect {
    public async initialize(req: Request, res: Response ) {

        const { friendLetC } = req.body;
        const KEY = process.env.KEY || "test";
        
        const iv = Buffer.alloc(16);

        const friendLetTest = this.decryptMessage(friendLetC , KEY, iv);

        const friendLet = process.env.FRIEND_LET;

        if( friendLetTest === friendLet) {
            const { idC, soulNameC, emailC } = req.body;
            

            const id = this.decryptMessage(idC, KEY, iv);
            const soulName = this.decryptMessage(soulNameC, KEY, iv);
            const email = this.decryptMessage(emailC, KEY, iv);

            
            console.log(id, soulName, email );
            return res.status(200).json({message: "você conseguiu!", friendLetTest}).end()
        } 
        return res.status(401).send({message: "unauthorized!"})
  
    }

    private decryptMessage(encryptedMessage: string, key: string, iv: Buffer): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

export { Connect }