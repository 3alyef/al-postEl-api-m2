import { Message } from "../../interfaces/searchByEmail.interface";


class SearchUserByEmail {
    private URL_M1;
    constructor(){
        this.URL_M1 = process.env.URL_M1 || "need M1";
    }

    public async initialize( email: string ): Promise<Message>{
        const body = JSON.stringify({email})

        try {
            const response = await fetch(`${this.URL_M1}/searchUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.status === 500) {
                throw new Error(`status ${ response.status }`);
            } else if(response.status === 401){
                return { found: false, userSoul: null, message: "user not found" }
            }
            console.log("RESPONSE: ",response);
            console.log("JSON: ", await response.json())
            return await response.json();
        } catch (error) {
            console.error('Erro ao conectar com M1: ', error);
            return { found: false, userSoul: null, message: "internal server error" };
        }
    
    }

}

export default SearchUserByEmail;