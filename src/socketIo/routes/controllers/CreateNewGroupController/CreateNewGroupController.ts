import { Socket } from "socket.io";
import { newGroup, newGroupResponse } from "../../../interfaces/group.interface";
import { CreateGroup } from "../../../services/Services";

class CreateNewGroupController {
    public newGroup(socket: Socket, routeName: string,
        groupsExpectUsers: Map<string, newGroupResponse[]>, groupsAdmin: Map<string, string[]>, userSocketMap:Map<string, Socket[]>){
        socket.on(routeName, async ({groupName, groupParticipants}: newGroup)=>{

            // Será enviando o nome do grupo e os participantes iniciais. O servidor terá a missao de criar um _id proprio do grupo (a partir da database)
            
            new CreateGroup().initialize(socket, {groupName, groupParticipants}, groupsExpectUsers, groupsAdmin, userSocketMap);
            
        })
    }
}

const createNewGroupController = new CreateNewGroupController();
export { createNewGroupController };