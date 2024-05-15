import { AllDataUser } from "../../interfaces/auth.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";
import { msgsDB, networksDB } from "../../interfaces/networkGetPrevious.interface";
import { findDataUser, roomNameGenerate } from "../Services";

class RestoreHistory {
    public async initialize(userSoul: string, roomsExpectUsers: Map<string, string[]>, previousMessages: Map<string, msgsResponse[]>, roomsProps: Map<string, AllDataUser[]>) {

        try {
            const networkList: networksDB[] | null = await this.getNetworkList(userSoul);
            if(networkList){
                //console.log("NetworkLis: ", networkList)
                for(const net of networkList){
                    const msgs = await this.getMessages(net);
                    //console.log("Dentro de try msgs=> "+msgs)
                    const room = roomNameGenerate(net.user, net.friend, roomsExpectUsers);

                    // ROOM PROPS
                    const AllDataAboutFriend: AllDataUser = await findDataUser(net.friend)
                
                    const AllDataAboutUser: AllDataUser = await findDataUser(net.user)
                    if(!roomsProps.has(room)) {
                        roomsProps.set(room, []);
                    }

                    roomsProps.get(room)?.push(AllDataAboutFriend);
                    roomsProps.get(room)?.push(AllDataAboutUser);
                   
                    
                    let rooms = roomsExpectUsers.get(userSoul);
                    if(!rooms){
                        rooms = [];
                        roomsExpectUsers.set(userSoul, rooms);
                    }
                    rooms.push(room);

                    if(msgs){
                        const newRoomObj: msgsResponse[] = []; 
                        for(const msg of msgs){
                            
                            // Linka o usuario com sua respectiva sala de acordo com a networkList
                            //console.log("HINE",roomsExpectUsers.get(userSoul))

                            const msgsT: msgsResponse = {
                                    _id: msg._id,
                                    fromUser: msg.fromUser,
                                    isDeletedToFrom: msg.isDeletedToFrom,
                                    toUser: msg.toUser,
                                    message: msg.message, 
                                    createdIn: msg.createdIn
                                }
                            console.log(msgsT)
                            newRoomObj.push(msgsT); 
                        }
                        //console.log("Sala: "+room, newRoomObj)
                        previousMessages.set(room, newRoomObj);
                    } 
                }
                
            }
            return;
        }catch(error){
            console.error("Error na atualização de dados:"+error);
            return;
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
            console.log("hine", data)
            if (!data) {
                return null; // Retorna null se não houver dados
            }
    
            if ('error' in data) {
                throw new Error(data.error);
            } else {
                console.log("Aqui está o network: ", data)
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
