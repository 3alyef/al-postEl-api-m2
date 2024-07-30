import { Request, Response } from "express";
import { userModel, dataUserImageModel } from "../../db/models/Models";
import { CustomError } from "../../interfaces/common.interface";
import { TokenGenerate } from "../Services";

interface userLoginEmail {
    email: string; 
    soulName: string 
}

export interface imageProps {
    userImage: string | undefined;
    lastUpdateIn: string | undefined
}

export class EmailLogin {
    public async initialize(req: Request<{body:{email: string}}>, res: Response) {
        try {
            
            const {email} = req.body;
            if(email){
                const userData: userLoginEmail | null = await this.searchEmail(email)
                if(userData){
                    // Irá buscar pela fota de perfil do usuario
                    const profileImage: imageProps | null = await searchProfile(userData.soulName)
                    if(profileImage){
                        const token: string = new TokenGenerate().TokenGenerator(profileImage)
                        res.status(200).json({ token })
                    } else {
                        const token: string = new TokenGenerate().TokenGenerator({userImage: undefined, lastUpdateIn: undefined})
                        res.status(200).json({ token })
                    }
                
                } else {
                    throw {status: 401, message: "email não encontrado..."}
                }
                
            } else {
                throw {status: 401, message: "email é obrigatorio!"}
            }
            
        } catch(error) {
            const { status, message } = error as CustomError;
            console.error("Erro ao tentar buscar email: "+ message);
            res.status(status).json({ message }).end();
        }
    }

    private async searchEmail(email: string): Promise<userLoginEmail | null> {   
        const user: userLoginEmail | null = await userModel.findOne({ email: email }, 'email soulName');
        if (user) {
           
            return user;
        } else {
          
            return null;
        }   
    }

}

export async function searchProfile(soulName: string): Promise<imageProps>{
    const image: imageProps | null = await
    dataUserImageModel.findOne({soulName: soulName}, "userImage lastUpdateIn")
    if (image) {
       
        return image;
    } else {
      
        return {lastUpdateIn: undefined, userImage: undefined};
    }
}