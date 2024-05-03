import { NonNullExpression } from "typescript";
import { MessageUserResponse } from "../../interfaces/searchByEmail.interface";


class SearchUserByCustomName {

    public async initialize( customName: string ): Promise<MessageUserResponse>{

        try {
            const body = JSON.stringify({customName})
            const response = await fetch(`${process.env.URL_M1}/searchUserByCostumName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (!response.ok) {
                //console.log("HINEEEEE")
                throw new Error();
            }  
     
            return await response.json();
        } catch (error) {
            console.error('Erro ao conectar com M1: ', error);
            return { 
                found: false, 
                dataUser: 
                [{
                    first_name: null, 
                    userImageData: 
                    {lastUpdateIn: null, userImage: null}, 
                    userSoul: null, 
                    costumName: 
                    {custom_name:undefined, lastUpdateIn: undefined},
                    email: null
                }],  
                message: "internal server error" 
            };
        }
    
    }

}

export default SearchUserByCustomName;