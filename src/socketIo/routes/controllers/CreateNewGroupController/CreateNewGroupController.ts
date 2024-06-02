import { Socket } from "socket.io";
import { newGroup, newGroupResponse } from "../../../interfaces/group.interface";
import { CreateGroup } from "../../../services/Services";

export interface propsGroupsReq {
    groupImage: {image: File, type: string, name: string}
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants?: string[]
}

class CreateNewGroupController {
    public newGroup(socket: Socket, routeName: string,
        groupsExpectUsers: Map<string, newGroupResponse[]>, groupsAdmin: Map<string, string[]>, userSocketMap:Map<string, Socket[]>){
        socket.on(routeName, async ({groupImage, groupName, groupParticipants}: propsGroupsReq)=>{
            let reconstructedFile 
            if(groupImage.image){
                const blob = new Blob([groupImage.image], { type: groupImage.type });
                reconstructedFile = new File([blob], groupImage.name);
            }
            

            
            // Será enviando o nome do grupo e os participantes iniciais. O servidor terá a missao de criar um _id proprio do grupo (a partir da database)
            new CreateGroup().initialize(socket, {groupName, groupParticipants}, groupsExpectUsers, groupsAdmin, userSocketMap, reconstructedFile);
            
        })
        
    }
    
}

const createNewGroupController = new CreateNewGroupController();
export { createNewGroupController };