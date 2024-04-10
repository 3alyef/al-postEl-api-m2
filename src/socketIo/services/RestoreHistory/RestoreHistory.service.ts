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
        try {
            const networkList: networksDB[] | null = await this.getNetworkList(userSoul);
            if(networkList){
                console.log("NetworkLis: ", networkList)
                for(const net of networkList){
                    const msgs = await this.getMessages(net);
                    console.log("Dentro de try msgs=> "+msgs)
                    const room = this.roomNameGenerate(net.user, net.friend, roomsExpectUsers)
                    roomsExpectUsers.set(userSoul, [room]); 
   
                    if(msgs){
                        const newRoomObj: msgsResponse[] = []; 
                        for(const msg of msgs){
                            
                            // Linka o usuario com sua respectiva sala de acordo com a networkList
                            console.log("HINE",roomsExpectUsers.get(userSoul))

                            const msgsT: msgsResponse = {
                                    _id: msg._id,
                                    fromUser: msg.fromUser,
                                    toUser: msg.toUser,
                                    message: msg.message, 
                                    createdIn: msg.createdIn
                                }
                            
                            newRoomObj.push(msgsT); 
                            console.log("Aqui está msg: ", msgsT)
                        }
                        
                        previousMessages.set(room, newRoomObj);
                    } else {
                        const _userList = roomsExpectUsers.get(net.user);
                
                        if(!_userList){
                            roomsExpectUsers.set(net.user, [room]);
                        } else {
                            _userList?.push(room);
                        }
                    }
                }
                
            }
            return;
        }catch(error){
            console.error("Error na atualização de dados:"+error);
            return;
        }
    }
    private roomNameGenerate(user: string, friend: string, roomsExpectUsers: Map<string, string[]>): string{
        try {
            const randomRoomNumber1 = Math.floor(Math.random() * 101); 

            const randomRoomNumber2 = Math.floor(Math.random() * 101); 

            const roomName = `${randomRoomNumber1}${friend}El${user}${randomRoomNumber2}`;
            // Pegar todas as salas de friend e user. E conferir se existe uma sala igual entre user e friend se não existir criar uma sala e retornar ela, se já existir retornar a mesma sala

            // Verifique se já existe uma sala entre os dois usuários
            //console.log("user"+ user, "friend"+ friend)
            const friendRooms = roomsExpectUsers.get(friend);
            if (friendRooms) {
                // Verifique se há uma sala comum entre os usuários nas salas do friend
                const commonRoomFriend = friendRooms.find(room => room.includes(user) && room.includes(friend));
                if (commonRoomFriend) {
                    // Se já existir uma sala entre os dois usuários nas salas do amigo, retorne essa sala
                    return commonRoomFriend;
                } 
            } 
            
            return roomName;
        } catch(error) {
            throw new Error("Falha ao gerar roomName: "+ error);
        }
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
    
            const data: networksDB[] | { error: string } | null = await response.json();
    
            if (!data) {
                return null; // Retorna null se não houver dados
            }
    
            if ('error' in data) {
                throw new Error(data.error);
            } else {
                console.log("Aqui está o network: "+ data)
                return data;
            }
            
        } catch(error){
            throw new Error("Erro ao solicitar a networkList: " + error);
        }
    }
    private async getMessages(network: networksDB): Promise<msgsDB[] | null>{
        try {
            const body = JSON.stringify({ userA: network.user, userB: network.friend })
            const response = await fetch(`${process.env.URL_M3}/previousMsgs`,{
            
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
                console.log("Data: "+data)
                return data;
            }
        }catch(error){
            throw new Error("Erro ao solicitar a lista de menssagens conforme o dito da networkList"+ error);
        }
        

    }
    
}

export { RestoreHistory };
