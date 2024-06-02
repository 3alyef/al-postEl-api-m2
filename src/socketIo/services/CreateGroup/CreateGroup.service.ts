import { Socket } from "socket.io";
import { newGroup, newGroupResponse } from "../../interfaces/group.interface";
import { DecodedData } from "../../interfaces/auth.interface";
import { localResgistrer } from "../Services";
class CreateGroup{
    public async initialize(socket: Socket, {groupName, groupParticipants}: newGroup, groupsExpectUsers: Map<string, newGroupResponse[]>, groupsAdmin: Map<string, string[]>, userSocketMap:Map<string, Socket[]>,
    reconstructedFile: File | undefined
    ){
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
            let urlImage: {message: string, urlPhoto: string, lastUpdateIn: string} | undefined 
            if(reconstructedFile){
                urlImage = await this.changeGroupImage(groupId, reconstructedFile);
            }
            

            resp.groupAdministratorParticipants.forEach((admPart)=>{
                //
                const group = groupsAdmin.get(groupId);
                if(!group){
                    const group: string[] = []
                    groupsAdmin.set(groupId, group)
                }
                group?.push(admPart);
                //
                localResgistrer(admPart, resp, groupsExpectUsers, userSocketMap, 
                    {
                        _id: groupId, groupAdministratorParticipants: [userSoul], 
                        imageData: {userImage: urlImage?.urlPhoto || '', lastUpdateIn: urlImage?.lastUpdateIn || ''}, 
                        groupName, groupParticipants 
                    }
                )
            })

            resp.groupParticipants.forEach((groupPart)=>{
                
                if(!resp.groupAdministratorParticipants.includes(groupPart)){
                    localResgistrer(groupPart, resp, groupsExpectUsers, userSocketMap, 
                        {
                            _id: groupId, groupAdministratorParticipants: [userSoul], 
                            imageData: {userImage: urlImage?.urlPhoto || '', lastUpdateIn: urlImage?.lastUpdateIn || ''}, 
                            groupName, groupParticipants 
                        }
                    )
                }       
            })
            
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
    };
    private async changeGroupImage(_id: string, image: File): Promise<{message: string, urlPhoto: string, lastUpdateIn: string} | undefined>{
        try {
            // Cria um objeto FormData
            const formData = new FormData();
            formData.append('imagem', image); 

            // Faz a requisição fetch
            const resp = await fetch(`${process.env.URL_M2}/addPhoto`, {
                method: 'POST',
                headers: {
                    'soulName': _id,
                    'method': 'changeGroupProfile'
                },
                body: formData,
            });

            // Verifica a resposta
            if (!resp.ok) {
                throw new Error(`Erro na requisição: ${resp.statusText}`);
            }

            // Processa a resposta
            const data = await resp.json();
            return data
        } catch(error){
            console.log(error);
        }
    }
}

export default CreateGroup;