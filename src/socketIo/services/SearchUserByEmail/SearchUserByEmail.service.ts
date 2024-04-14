import { Message } from "../../interfaces/searchByEmail.interface";


class SearchUserByEmail {

    public async initialize( email: string ): Promise<Message>{

        try {
            const body = JSON.stringify({email})
            const response = await fetch(`${process.env.URL_M1}/searchUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (!response.ok) {

                throw new Error();
            }  
     
            return await response.json();
        } catch (error) {
            console.error('Erro ao conectar com M1: ', error);
            return { found: false, userSoul: null, message: "internal server error" };
        }
    
    }

}

export default SearchUserByEmail;