import { SearchByCostumName, SearchByEmail } from "../../../express/services/Services";
import { imageResp } from "../../../express/services/SearchByEmail/SeachByEmail.service";
import { costumName } from "../../../express/services/Login/Login.service";

interface DataUser {
    first_name: string;
    userSoul: string;
    userImageData: imageResp;
    costumName: costumName;
    email?: string
}

export interface AllDataUser {
    status: number;
    found: boolean;
    dataUser: DataUser[] | null;
    message: string
}

class SearchUserController{
    async postSearchUserByEmail(email: string): 
    Promise<AllDataUser>{ 

        // TODO: Busque pelo userSoul na DB atráves do email

        try {
            const dataUser: DataUser | {message: string} | null = await new SearchByEmail().initialize(email);

            if( dataUser && 'first_name' in dataUser ){
                console.log("FOUND: ", dataUser)
                return { status: 200, found: true, dataUser: [{...dataUser, email}], message: "found" }
            }

            if( dataUser && 'message' in dataUser){
                console.log("NOT FOUND")
                return { status: 404, found: false, dataUser: null, message: dataUser.message }
            } else {
                console.log("NOT FOUND")
                return { status: 404, found: false, dataUser: null, message: "not found" }
            }
        } catch(error){
            console.error('Erro durante a pesquisa por email:', error);
            return { status: 500, found: false, dataUser: null, message: "internal server error" }
        }
    }

    async postSearchByCostumName(customName: string): 
    Promise<AllDataUser> {

        // TODO: Busque pelo userSoul na DB atráves do email

        try {
            const dataUser:{first_name: string, userSoul: string, userImageData: imageResp, costumName: costumName, email: string}[] | {message: string} | null = await new SearchByCostumName().initialize(customName);

            if( dataUser && !('message' in dataUser)){
                console.log("FOUND: ", dataUser)
                return { status: 200, found: true, dataUser, message: "found" }
            }

            if( dataUser && 'message' in dataUser){
                console.log("NOT FOUND")
                return { status: 404, found: false, dataUser: null, message: dataUser.message }
            } else {
                console.log("NOT FOUND")
                return { status: 404, found: false, dataUser: null, message: "not found" }
            }
        } catch(error){
            console.error('Erro durante a pesquisa por email:', error);
            return { status: 500, found: false, dataUser: null, message: "internal server error" }
        }
    }
}

const searchUserMethodsM1 = new SearchUserController();
export { searchUserMethodsM1 }