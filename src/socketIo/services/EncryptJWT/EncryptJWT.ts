const jwt = require("jsonwebtoken");

type TokenPayload = {
    update: boolean;
    roomName: string;
    users: string[];
    token: string;
};

type Content = TokenPayload | Array<string | boolean | string[]>;


class EncryptJWT {
    private tokenKey: string;
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY || "token key";// chave de criptografia do token
    }

    TokenGenerator( content: Content ): string{
        // 1800 => 30min  30 => 0.5min
        const token = jwt.sign( content, this.tokenKey, { expiresIn: 3600 })

        return token;
    }
    // criptografa os dados
}

export { EncryptJWT };