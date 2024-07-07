import { msgsGroupDB, msgsGroupFromDB, newGroupResponse } from "../../interfaces/group.interface";
import { findMainDataImage } from "../FindDataUser/FindDataUser.service";

class RestoreGroup {
    public async initialize(userSoul: string, groupsExpectUsers: Map<string, newGroupResponse[]>, groupsAdmin = new Map<string, string[]>(), previousGroupMessages: Map<string, msgsGroupDB[]>) {

        // Primeiro get todos os names groups and after depositar esses names no groupsExpectUsers. Depois disso, pegar todas as mensagens e depositar em previousMessages.
        
        try {
            const groups: newGroupResponse[] | null = await this.getGroupList(userSoul);
            if(groups){
                //console.log("GRUPO")
                for(const group of groups){
                    const groupId = group._id;
                    const images = await findMainDataImage(groupId);
                    group.imageData = images;
                    //console.log('groupDATA', group);
                    for(const admins of group.groupAdministratorParticipants){
                        let groupAdmins = groupsAdmin.get(groupId);
                        if(!groupAdmins){
                            groupAdmins = []
                            groupsAdmin.set(groupId, groupAdmins)
                        }
                        groupAdmins.push(admins);
                        //console.log("GRUPO ADMIN", groupName, admins)
                    };

                    // HERE -----------------
                    for(const user of group.groupParticipants){
                        let groupUsers = groupsExpectUsers.get(user)
                        if(!groupUsers){
                            groupUsers = [];
                            groupsExpectUsers.set(user, groupUsers)
                        }
                        groupUsers.push(group);
                        //console.log("Grupo EXPECT", groupUsers)
                    };
                    const msgs: msgsGroupFromDB[] | null = await this.getMessages(group);
                    ///
                    //console.log('msgBEFORE', msgs);
                    ///
                    if(msgs){
                        
                        if(msgs.length > 0){
                            for(const msg of msgs) {    
                                let _msgList = previousGroupMessages.get(groupId);
                    
                                if(!_msgList){
                                    _msgList = [];
                                    previousGroupMessages.set(groupId, _msgList);
                                } 
                                _msgList.push(msg);
                            }
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
    private async getGroupList(userSoul: string): Promise<newGroupResponse[] | null>{
        try{
            const body = JSON.stringify({user: userSoul});
            const response = await fetch(`${process.env.URL_M3}/previousGroups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
    
            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            } 
    
            const data: newGroupResponse[] | { error: string } | null = await response.json();
    
            if (!data) {
                return null; // Retorna null se não houver dados
            }
    
            if ('error' in data) {
                throw new Error(data.error);
            } else {
                //console.log("Aqui está os groups: ", data)
                return data;
            }
            
        } catch(error){
            throw new Error("Erro ao solicitar a groupList: " + error);
        }
    }
    
    
    private async getMessages(groupData: newGroupResponse): Promise<msgsGroupFromDB[] | null>{
        try {
            const body = JSON.stringify({ group: groupData._id })
            const response = await fetch(`${process.env.URL_M3}/previousGroupMsgs`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            
            })
            if (!response.ok) {
                throw new Error(`Falha na solicitação: ${response.statusText}`);
            } 
            const data: msgsGroupFromDB[] | { error: string }= await response.json();
            //console.log("mensagem", data)
            if ('error' in data) {
               
                throw new Error(data.error);
            } else {
                console.log("Data: "+data)
                return data;
            }
        }catch(error){
            throw new Error("Erro ao solicitar a lista de menssagens: "+ error);
        }
        

    }
    
}

export { RestoreGroup };


// Converte Map ==> String_Map:
export function mapToString<K, V>(map: Map<K, V>): string{
    return JSON.stringify(Array.from(map.entries()));
}

// Converte String_Map ==> Map:
export function stringToMap<K, V>(str: string): Map<K, V> {
    const parsedEntries: [K, V][] = JSON.parse(str);
    return new Map<K, V>(parsedEntries);
}
