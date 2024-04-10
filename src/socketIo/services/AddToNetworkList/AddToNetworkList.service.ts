import { networkListRequest } from "../../interfaces/networkSetNew.interface";

class AddToNetworkList {
    public async initialize(user: string, friend: string){
        try {
            const dateInf = new Date(); 
            const data = dateInf.toISOString();
            const createdIn = data
            const newNetwork1: networkListRequest = {
                user,
                friend,
                createdIn
            }
            const newNetwork2: networkListRequest = {
                user: friend,
                friend: user,
                createdIn
            }

            await this.setNewNetwork(newNetwork1);
            await this.setNewNetwork(newNetwork2);
        } catch(error) {
            console.error("Erro ao criar new network: "+ error)
        }
    }

    private async setNewNetwork(newNetwork: networkListRequest) {
        try {
            const body = JSON.stringify(newNetwork);
            const response = await fetch(`${process.env.URL_M3}/setNewNetwork`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }) 

            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            } 
            const data = await response.json();
            console.log(data)
     
            return data;
        } catch (error){
            throw new Error("Error ao enviar requisição: " + error);
        }
    }
}

export default AddToNetworkList;