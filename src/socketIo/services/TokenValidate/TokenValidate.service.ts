const jwt = require("jsonwebtoken");
import { TokenExpiredError } from "jsonwebtoken";
type DecodedToken<T> = T | null;

class TokenValidate<T>{

    private tokenKey: string;
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY || "need key";
    }

    tokenValidate(token: string): {decoded: DecodedToken<T>, error: { message: string, status: number} | null }{
        try {
            const decoded = jwt.verify(token, this.tokenKey) as T;
            return { decoded, error: null };
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                const error = { message: 'Token expirado', status: 401 };
                return { decoded: null, error };
            } else {
                const error = { message: 'Autênticação falhou', status: 401 };
                return { decoded: null, error };
            }
        }
    }
}

export default TokenValidate;