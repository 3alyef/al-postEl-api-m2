import { Socket } from "socket.io";
import { newGroup, newGroupResponse } from "../../interfaces/group.interface";
import { DecodedData } from "../../interfaces/auth.interface";

class CreateGroup{
    public async initialize(socket: Socket, {groupName, groupParticipants}: newGroup, groupsExpectUsers: Map<string, string[]>){
        try {
            const decoded: DecodedData = socket.auth;

            const { userSoul } = decoded;
            const participants = groupParticipants;
            participants.push(userSoul);

            const group: newGroup = {
                groupName,
                groupParticipants: participants,
                groupAdministratorParticipants: [userSoul]
            }
            const resp: newGroupResponse = await this.createNewGroup(group);
            
            await this.localResgistrer(resp, groupsExpectUsers);
            return

        } catch( error ){
            console.error("Erro ao criar novo grupo: "+ error)
        }
     
    }

    private async createNewGroup(group: newGroup){
        try {
            const body = JSON.stringify(group)
            const response = await fetch(`${process.env.URL_M3}/newGroup`, {
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
           
    
            if (!data) {
                return null; // Retorna null se não houver dados
            }
    
            if ('error' in data) {
                throw new Error(data.error);
            } else {
                return data;
            }
        } catch(error) {
            throw new Error("Erro ao contactar M3: " + error);
        }
    }

    private async localResgistrer(resp: newGroupResponse, groupsExpectUsers: Map<string, string[]>){
        
    }
}

export default CreateGroup;