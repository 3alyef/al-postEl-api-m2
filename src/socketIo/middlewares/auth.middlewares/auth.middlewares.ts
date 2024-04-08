import { Socket } from "socket.io";
import { TokenValidate } from "../../services/Services";
import { ExtendedError } from "socket.io/dist/namespace";
import { DecodedData, CustomError } from "../../../../custom";


export const verifyJWT = (socket: Socket, next: (err?: ExtendedError | undefined) => void)=>{
    const token: string = socket.handshake.headers.authorization || ""; 
    const {decoded, error} = new TokenValidate<DecodedData>().tokenValidate(token);
    
    if(error){ 
        // Se o token for válido o user tem acesso as outras salas se não a conexão é encerrada
        const {status, message} = error;
        console.error('Erro de autenticação:', error.message);

        socket.emit('auth_error', { message, status });
        socket.once('disconnect', () => {
            console.log('Cliente desconectado após erro de autenticação');
        });
        
        const err: CustomError = new Error("not authorized");
        err.data = { content: "Please retry later" }; // additional details
        next(err);
        
    } else {
        socket.auth = decoded
        next();
    }
}