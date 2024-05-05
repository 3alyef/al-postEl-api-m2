import { searchProfileInt } from "../EmailLogin/EmailLogin.service";

const jwt = require("jsonwebtoken");


class TokenGenerate {
    private tokenKey: string;
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY_ALPOSTEL || "token key";// chave de criptografia do token
    }

    public TokenGenerator( content: searchProfileInt ): string{
        // 1800 => 30min  30 => 0.5min
        
        const token = jwt.sign( {image: content.userImage, lastUpdateIn: content.lastUpdateIn}, this.tokenKey, { expiresIn: 7200 })
        return token;
    }
    // criptografa os dados
}

export { TokenGenerate };