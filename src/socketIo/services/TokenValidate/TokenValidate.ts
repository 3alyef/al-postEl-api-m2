const jwt = require("jsonwebtoken");

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;
}

class TokenValidate{

    private tokenKey: string;
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY || "need key";
    }

    tokenValidate(token: string): {decoded: decodedToken | null, error: { message: string, status: number} | null }{
        try {
            const decoded = jwt.verify(token, this.tokenKey);
            return { decoded, error: null };
        } catch (err) {
            const error = { message: 'Autenticação falhou', status: 401 };
            return { decoded: null, error };
        }
    }
}

export {TokenValidate}