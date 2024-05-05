import { Request, Response } from "express";
import { SearchByCostumName, SearchByEmail } from "../../../services/Services";
import { imageResp } from "../../../services/SearchByEmail/SeachByEmail.service";
import { costumName } from "../../../services/Login/Login.service";



class SearchUserController{
    async postSearchUserByEmail(req: Request, res: Response){
        const {email} = req.body;

        // TODO: Busque pelo userSoul na DB atráves do email

        try {
            const dataUser:{first_name: string, userSoul: string, userImageData: imageResp, costumName: costumName} | null = await new SearchByEmail().initialize(email);

            if(dataUser){
                console.log("FOUND: ", dataUser)
                res.status(200).json({ found: true, dataUser: [{...dataUser, email}], message: "found" }).end();
            } else {
                console.log("NOT FOUND")
                res.status(404).json({ found: false, dataUser: null, message: "not found" }).end();

            } 
        } catch(error){
            console.error('Erro durante a pesquisa por email:', error);
            res.status(500).send({ found: false, message: "internal server error" }).end();
        }
    }

    async postSearchByCostumName(req: Request, res: Response) {
        const {customName} = req.body;

        // TODO: Busque pelo userSoul na DB atráves do email

        try {
            const dataUser:{first_name: string, userSoul: string, userImageData: imageResp, costumName: costumName, email: string}[] | null = await new SearchByCostumName().initialize(customName);

            if(dataUser){
                console.log("FOUND: ", dataUser)
                res.status(200).json({ found: true, dataUser, message: "found" }).end();
            } else {
                console.log("NOT FOUND")
                res.status(404).json({ found: false, dataUser: null, message: "not found" }).end();

            } 
        } catch(error){
            console.error('Erro durante a pesquisa por email:', error);
            res.status(500).send({ found: false, message: "internal server error" }).end();
        }
    }
}

const searchUserController = new SearchUserController();
export { searchUserController }