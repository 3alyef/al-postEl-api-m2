interface Message {
    found: boolean,
    userSoul: string | null, 
    message: string 
}

class SearchUserByEmail {
    private URL_M1;
    constructor(){
        this.URL_M1 = process.env.ACCESS_ALLOW_ORIGIN || "need M1";
    }

    public async initialize( email: string ): Promise< Message >{
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

            return await response.json();
        } catch (error) {
            console.error('Erro ao conectar com M2: ', error);
            return { found: false, userSoul: null, message: "internal server error" };
        }
    
    }

}

export { SearchUserByEmail }