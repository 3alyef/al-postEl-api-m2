import { Request, Response } from "express";
import { userModel } from "../../db/models/Models";
import { hash } from "bcrypt";
import { randomInt } from "node:crypto";
import { CustomError } from "../../interfaces/common.interface";
class Register {

    public async initialize(req: Request, res: Response) {
        const { first_name, last_name, email, password, repeatPassword, image } = req.body;
        
        
        try {
            if(first_name && email && password && repeatPassword){
                const _isPasswordOk= this.verifyPassword(password, repeatPassword);
            
                if(_isPasswordOk){
                    const _alreadyHaveEmail = await this.verifyEmail(email);
                    if(!_alreadyHaveEmail) {
                        
                        const soulName = await this.generateSoulName(first_name);
                        if(soulName){ 
                            const EncryptPass = await this.passwordEncrypt(password);
                            const newUser = await this.createNewAccount(first_name, last_name, email, EncryptPass, soulName);
                           
                            return res.status(201).json({ message: "Registro bem-sucedido.", status: 201}); 
                                       
                        } else {
                            throw {message: "Erro ao gerar soulName", status: 500}
                        }

                    } else {
                        throw { message: "Email já cadastrado.", status: 400}
                    }
                } else {
                    throw { message: "As senhas não correspondem", status: 406}
                }
            } else {
                throw { message: "Dados invalidos ou faltando", status: 401}
            }
            
            
        } catch (error) {
            const { status, message } = error as CustomError;
            console.error("Erro ao registrar: "+ message);
            res.status(status).json({ message }).end();
        }
       
    }

    private verifyPassword(password: string, repeatPassword: string): boolean {  
        if(repeatPassword !== null && password !== repeatPassword){
            return false;
        }
        return true;   
    }

    private async verifyEmail(email: string): Promise<boolean> {

        try {
            // Verifica se já há um usuário cadastrado com o mesmo email
            const userExists = await userModel.exists({ email: email });
            return userExists ? true : false; 
            
        } catch (error) {
            console.error(error);
            throw {message: "Ocorreu um erro ao verificar o email.", status: 500};
        }
        
    }

    private async generateSoulName(first_name: string): Promise<string> {
        let user: string;
        if (first_name.includes(" ")) {
            user = first_name.split(" ")[0];
        } else {
            user = first_name;
        }
        let soulName = `rukh0${user}1`;
        const documentos: any[] = await userModel.find({});
        const soulNames: string[] = documentos.map(doc => doc.soulName);

        // Gera um soulName único
        let i = 1;
        while (soulNames.includes(soulName)) {
            soulName = `rukh${i}${user}${i + 1}`;
            i++;
        }

        return soulName;
    
    }

    private async passwordEncrypt(password:string){    
        let EncryptPass: string;    
        const randomSalt = randomInt(10, 16);
        EncryptPass = await hash(password, randomSalt);
        if(!EncryptPass){
            throw {message: "Erro ao encriptar password: ", status: 500}
        }
        return EncryptPass;
    }
    
    private async createNewAccount(first_name: string, last_name: string, email: string, password: string, soulName: string): Promise<object> {        
        const newUser = new userModel (
            {
                first_name,
                last_name,
                email: email,
                password: password,
                soulName: soulName
            }
        )

        await newUser.save();
        if(!newUser){
            throw {message: "Ocorreu um erro ao criar a conta.", status: 501}
        }
        return newUser; 
    }

    
}

export { Register };

/**private async createNewImage(image: string, soulName: string): Promise<object> {
        const dateInf = new Date(); 
        const lastUpdateIn =  dateInf.toISOString();
        const newUserImage = new DataUserImageModel (
            {
                userImage: image,
                soulName: soulName,
                lastUpdateIn   
            }
        )

        await newUserImage.save();
        if(!newUserImage){
            throw {message: "Ocorreu um erro ao salvar imagem.", status: 501}
        }
        return newUserImage; 
    } */