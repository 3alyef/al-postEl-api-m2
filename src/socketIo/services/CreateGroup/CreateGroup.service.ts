import { Socket } from "socket.io";
import { newGroup, newGroupResponse } from "../../interfaces/group.interface";
import { DecodedData } from "../../interfaces/auth.interface";
import { localResgistrer } from "../Services";
class CreateGroup{
    public async initialize(socket: Socket, {groupName, groupParticipants}: newGroup, groupsExpectUsers: Map<string, string[]>, groupsAdmin: Map<string, string[]>, userSocketMap:Map<string, Socket[]>){
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
            const groupId = resp._id;
            
            
            resp.groupAdministratorParticipants.forEach((el)=>{
                //
                const group = groupsAdmin.get(groupId);
                if(!group){
                    const group: string[] = []
                    groupsAdmin.set(groupId, group)
                }
                group?.push(el);
                //
                localResgistrer(el, groupId, groupsExpectUsers, userSocketMap, true)
            })

            resp.groupParticipants.forEach((el)=>{
                
                if(!resp.groupAdministratorParticipants.includes(el)){
                  
                    localResgistrer(el, groupId, groupsExpectUsers, userSocketMap, false)
                }       
            })
            
            //await localResgistrer(resp, groupsExpectUsers);
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

    
}

export default CreateGroup;