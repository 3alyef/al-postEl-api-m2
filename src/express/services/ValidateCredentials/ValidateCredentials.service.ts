import { compare } from "bcrypt";
import { userModel } from "../../db/models/Models";

export async function validateCredentials(email: string, password: string, isLogin: boolean){
    try {
        
        const passHashed: {id: string, password: string} | null = await userModel.findOne({email}, 'password' )
        if( passHashed ){
            const isOk = await compare(password, passHashed.password);
            if( isOk ) {
                return { passEncrypt: passHashed.password }
            } else {           
                throw {message: isLogin ? "Password Invalid!" : "Credential Invalid! ", status: isLogin ? 401 : 422}
            }
        } else {
            throw {message: isLogin ? "Credential Invalid!" : "Email Invalid!" , status: isLogin ? 401 : 404}
            
        }
    } catch(error) {
        throw error;
    }
}