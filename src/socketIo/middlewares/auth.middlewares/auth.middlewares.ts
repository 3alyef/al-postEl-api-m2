import { Socket } from "socket.io";
import { TokenValidate } from "../../services/Services";
import { ExtendedError } from "socket.io/dist/namespace";
import { DecodedData } from "../../interfaces/auth.interface"

export function verifyJWT (socket: Socket, next: (err?: ExtendedError | undefined) => void){
    const token: string = socket.handshake.headers.authorization || ""; 
    const {decoded, error} = new TokenValidate<DecodedData>().tokenValidate(token);
    console.log(decoded)
    
    if(error){ 
        // Se o token for válido o user tem acesso as outras salas se não a conexão é encerrada
        const {status, message} = error;
        console.log('Erro de autenticação:', message, status);
        socket.emit('auth_error', { message, status });
        
        const err = new Error("not authorized");
        err.message = "Please retry later" 
        next(err)

    } else {
        socket.auth = decoded
        if(decoded){
            socket.emit('updateSoul', {soulName: decoded.userSoul,userProps: decoded })
        }
        
        next();
    }
} 