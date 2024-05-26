import { dataUserImageModel, dataUserModel, userModel } from "../../db/models/Models";
import { costumName, findCostumName } from "../Login/Login.service";


export interface imageResp {
    userImage: string | undefined; 
    lastUpdateIn: string | undefined
}
interface User {
    userSoul: string;
    custom_name: string;
    lastUpdateIn: string;
}
interface dataToReturn {
    userSoul: string; // k
    first_name: string; 
    costumName: costumName; // k
    userImageData: imageResp; 
    email: string
}
class SearchByCostumName {
    public async initialize(costumName: string): Promise<dataToReturn[] | {message: string} | null>{
        try {
            const userData: User[] | {message: string} = await this.findUserByCN(costumName);
           
            if('message' in userData){
                return {message: userData.message}
            }
            
            //let dataToReturn: dataToReturn[] = [];
            const dataToReturn: dataToReturn[] = await Promise.all(userData.map(async (el) => {
                const costumNameArray: costumName = { custom_name: el.custom_name, lastUpdateIn: el.lastUpdateIn };

                const userImageData = await this.findImage(el.userSoul);
                const { email, first_name } = await this.findDataUserByUserSoul(el.userSoul);

                return {
                    costumName: costumNameArray,
                    email,
                    first_name,
                    userImageData,
                    userSoul: el.userSoul
                };
            }));

            
            return null
            
        } catch (error) {     
            console.error('Erro durante a inicialização da pesquisa por email:', error);
            throw error;
        }
    }

    private async findUserByCN(customName: string, retry: boolean = true): Promise<User[] | {message: string}> {
        try {
            // Usando uma expressão regular para buscar custom_name que contenha customName
            const regex = new RegExp(`.*${customName}.*`, 'i');
            const users = await dataUserModel.find({ custom_name: regex }, 'soulName custom_name lastUpdateIn');

            // Mapeando os resultados para o formato desejado
            const formattedUsers: User[] = users.map(user => ({
                userSoul: user.soulName || '',
                custom_name: user.custom_name || '',
                lastUpdateIn: user.lastUpdateIn || ''
            }));

            // Verificando se encontrou algum usuário
            if (formattedUsers.length === 0) {
                return {message: "Usuário não encontrado na base de dados, method: Custom name"};
            }

            return formattedUsers;
        } catch (error) {
            if (retry) {
                // Se ocorrer um erro, e retry for verdadeiro, tenta novamente
                console.error('Erro ao encontrar usuário:', error);
                return this.findUserByCN(customName, false); // Tenta novamente sem repetir
            } else {
                const err = error as { message: string };
                console.error('Erro ao encontrar usuário após tentativas:', error);
                return { message: err.message };
            }
        }
    }
    

    private async findImage(userSoul: string): Promise<imageResp>{
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

    }

    private async findDataUserByUserSoul(userSoul: string): Promise<{ email: string, first_name: string}> {
        try {
            const user: { email: string, first_name: string } | null = await userModel.findOne({ userSoul }, 'email first_name');
    
            if (user) {
                // Retorna um objeto contendo o soulName do usuário
                return {email: user.email, first_name: user.first_name}
            } else {
                // Retorna null se nenhum usuário for encontrado
                return {email: '', first_name: ''};
            }
        } catch (error) {
            console.error('Erro ao encontrar usuário:', error);
            throw new Error('Ocorreu um erro ao encontrar o usuário.');
        }
    }
}



export { SearchByCostumName };