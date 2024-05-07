import { dataUserImageModel, userModel } from "../../db/models/Models";
import { searchProfile, searchProfileInt } from "../EmailLogin/EmailLogin.service";
import { costumName, findCostumName } from "../Login/Login.service";


export interface imageResp {
    userImage: string | undefined; 
    lastUpdateIn: string | undefined
}

class SearchByEmail {
    public async initialize(email: string): Promise<{userSoul: string, first_name: string, costumName: costumName, userImageData: imageResp} | {message: string} | null>{
        try {
            const userData: { userSoul: string, first_name: string } | {message: string} = await this.findUser(email);
            if('userSoul' in userData){
                let costumName: costumName | null;
                costumName = await findCostumName(userData.userSoul);
                let userImageDataSearch: searchProfileInt | null = await searchProfile(userData.userSoul);

                let userImageData: imageResp | null = {lastUpdateIn: undefined, userImage: undefined};

                if(userImageDataSearch?.lastUpdateIn && userImageDataSearch.userImage){
                    userImageData = {lastUpdateIn: userImageDataSearch?.lastUpdateIn, userImage: userImageDataSearch?.userImage}
                }
                
                if(!costumName){
                    costumName = {custom_name: undefined, lastUpdateIn: undefined} 
                }
                if(!userImageData) {
                    userImageData = {lastUpdateIn: undefined, userImage: undefined}
                }
                return {
                    userSoul: userData.userSoul, first_name:  userData.first_name, userImageData, costumName
                }
                   
                   
            }
            if('message' in userData){
                return {message: userData.message}
            }
            return null
        } catch (error) {     
            console.error('Erro durante a inicialização da pesquisa por email:', error);
            throw error;
        }
    }

    private async findUser(email: string): Promise<{ userSoul: string, first_name: string } | {message: string}> {
        try {
            const user: { soulName: string, first_name: string } | null = await userModel.findOne({ email }, 'soulName first_name');
    
            if (!user) {
                throw {message: "Erro ao buscar usuário"}
            }

            // Retorna um objeto contendo o soulName do usuário
            return {userSoul: user.soulName, first_name: user.first_name}
        } catch (error) {
            const err = error as {message: string}
            console.error('Erro ao encontrar usuário:', error);
            return {message: err.message}
        }
    }

}



export { SearchByEmail };