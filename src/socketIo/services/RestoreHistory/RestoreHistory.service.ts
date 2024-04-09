import { msgsResponse } from "../../interfaces/msgs.interface";
import { msgsDB, networksDB } from "../../interfaces/networkGetPrevious.interface";

class RestoreHistory {
    public async initialize(userSoul: string, roomsExpectUsers: Map<string, string[]>, previousMessages: Map<string, msgsResponse[]>) {
        /* TODO: (1) - Buscar a lista de network usando o userSoul; (2) - Enviar a lista de network de volta pedindo as mensagens correspondentes; (3) - Pegar as mensagens correspondentes e:

        roomsExpectUsers.set(userSoul, [roomName]);
        const msgs: msgsResponse = {
                _id: e._id,
                fromUser: e.fromUser,
                toUser: e.toUser,
                msg: e.msg, 
                createdIn: data
            }
        const newRoomObj: msgsResponse[] = []; 
        newRoomObj.push(msgs); 
        previousMessages.set(roomName, newRoomObj); 

        // Deve-se Criar roomName

        */
        const networkList: networksDB[] | null = await this.getNetworkList(userSoul);
        if(networkList){
            for(const net of networkList){
                const msgs = await this.getMessages(net);
                if(msgs){
                    
                }
            }
            
        }
        return
    }

    private roomNameGenerate(user: string, friend: string): string{
        const randomRoomNumber1 = Math.floor(Math.random() * 101); 

        const randomRoomNumber2 = Math.floor(Math.random() * 101); 

        const roomName = `${randomRoomNumber1}${friend}El${user}${randomRoomNumber2}`;

        return roomName
    }

    private async getNetworkList(userSoul: string): Promise<networksDB[] | null>{
        try{
            const body = JSON.stringify({user: userSoul});
            const response = await fetch(`${process.env.URL_M3}/previousNetwork`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })

            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            } 
            const data: networksDB[] | { error: string }= await response.json();
            if ('error' in data) {
                throw new Error(data.error);
            } else {
                return data;
            }
            
        }catch(error){
            console.error(error)
            return null;
        }
    }
    
    private async getMessages(network: networksDB): Promise<msgsDB[] | null>{
        try {
            const body = JSON.stringify({ userA: network.user, userB: network.friend })
            const response = await fetch(`${process.env.URL_M3}`,{
            
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            
            })
            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            } 
            const data: msgsDB[] | { error: string }= await response.json();

            if ('error' in data) {
                throw new Error(data.error);
            } else {
                return data;
            }
        }catch(error){
            console.error(error)
            return null
        }
        

    }
    
}

export { RestoreHistory };
