import { Message, MessageUserResponse } from "../../interfaces/searchByEmail.interface";


class SearchUserByEmail {

    public async initialize( email: string ): Promise<MessageUserResponse>{

        try {
            const body = JSON.stringify({email})
            const response = await fetch(`${process.env.URL_M1}/searchUserByEmail`, {
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
                [{first_name: null, 
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

export default SearchUserByEmail;