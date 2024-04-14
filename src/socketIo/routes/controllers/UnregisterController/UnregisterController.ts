import { Socket } from "socket.io";
import { unregisterRequest } from "../../../../express/interfaces/unregister.interface";
import { encryptCrypto } from "../../../services/Services";
import { CustomError } from "../../../interfaces/common.interface";
class UnregisterController {
    public async unregister(socket: Socket, routeName: string){
        socket.on(routeName, async ({email, password}: unregisterRequest)=>{
            try {
                console.log(email, password)
                const SECURE: string = process.env.KEY || "need key"
                const iv: Buffer = Buffer.alloc(16);
                const emailEC = await encryptCrypto(email, SECURE, iv);
                const passwordEC = await encryptCrypto(password, SECURE, iv);
                if(!emailEC || !passwordEC){
                    throw {message: "Erro ao encryptar data", status: 500}
                }
                await this.unregisterM1(emailEC, passwordEC)
                //await this.unregisterM2(emailEC);
           
                socket.emit(routeName, {message: "Conta excluída!"})
            } catch(error){
                const { status, message } = error as CustomError;
                console.error("Erro ao deletar conta: "+ message);
                socket.emit(routeName, {message, status})
            }
        })
    }

    private async unregisterM1(emailEC: string, passwordEC: string){
        try {
            const body = JSON.stringify({ email: emailEC, password: passwordEC });
            const response = await fetch(`${process.env.URL_M1}/unregister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            
            if (!response.ok) {

                throw { message: response.statusText, status: response.status }
            }  
            
            return;
        } catch (error) {
            throw error;
        }
    }
}
const unregisterController = new UnregisterController();

export { unregisterController }