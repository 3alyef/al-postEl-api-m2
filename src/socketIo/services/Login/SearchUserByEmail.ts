
class SearchUserByEmail {
    private URL_M1;
    constructor(){
        this.URL_M1 = process.env.ACCESS_ALLOW_ORIGIN || "need M1";
    }

    public async initialize( email: string ) {
        const body = JSON.stringify({email})

        try {
            const response = await fetch(`${this.URL_M1}/searchUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            }  

            return await response.json();
        } catch (error) {
            console.error('Erro ao conectar com M2:', error);
            return;
        }
    
    }

}

export { SearchUserByEmail }