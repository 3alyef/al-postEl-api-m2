import { dataUserImageModel, userModel } from "../../db/models/Models";
import { searchProfile, searchProfileInt } from "../EmailLogin/EmailLogin.service";
import { costumName, findCostumName } from "../Login/Login.service";


export interface imageResp {
    userImage: string | undefined; 
    lastUpdateIn: string | undefined
}

class SearchByEmail {
    public async initialize(email: string): Promise<{userSoul: string, first_name: string, costumName: costumName, userImageData: imageResp} | null>{
        try {
            const userData: { userSoul: string, first_name: string } | null = await this.findUser(email);
            if(userData){
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
            return null
        } catch (error) {     
            console.error('Erro durante a inicialização da pesquisa por email:', error);
            throw error;
        }
    }

    private async findUser(email: string): Promise<{ userSoul: string, first_name: string } | null> {
        try {
            const user: { soulName: string, first_name: string } | null = await userModel.findOne({ email }, 'soulName first_name');
    
            if (user) {
                // Retorna um objeto contendo o soulName do usuário
                return {userSoul: user.soulName, first_name: user.first_name}
            } else {
                // Retorna null se nenhum usuário for encontrado
                return null;
            }
        } catch (error) {
            console.error('Erro ao encontrar usuário:', error);
            throw new Error('Ocorreu um erro ao encontrar o usuário.');
        }
    }

    /*private async findImage(userSoul: string): Promise<imageResp>{
        try { 
            const image = await dataUserImageModel.findOne({soulName: userSoul}, "userImage lastUpdateIn")
            if(!image){
                throw {message: "erro ao buscar imagem"}
            }
            return {
                userImage: image.userImage ? image.userImage : undefined, 
                lastUpdateIn: image.lastUpdateIn ? image.lastUpdateIn : undefined
            }
        }catch(erro) {
            const {message} = erro as {message: string};
            console.log(message)
            return {userImage: undefined, lastUpdateIn: undefined}
        }

    }*/
}



export { SearchByEmail };