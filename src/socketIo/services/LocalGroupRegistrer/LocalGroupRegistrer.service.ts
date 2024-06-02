import { Socket } from "socket.io";
import { newGroupResponse } from "../../interfaces/group.interface";
export interface propsGroupsRes {
    _id: string;
    imageData: {userImage: string | undefined, lastUpdateIn: string | undefined}
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[]
}
export async function localResgistrer(userSoul: string, resp: newGroupResponse, groupsExpectUsers: Map<string, newGroupResponse[]>, userSocketMap:Map<string, Socket[]>, group: propsGroupsRes ){
    const socketUser = userSocketMap.get(userSoul);
    const isUserInGroup = groupsExpectUsers.get(userSoul)
    console.log('group-group-group-group', group)
    if(isUserInGroup){
        if(!isUserInGroup.some((obj) => obj._id.includes(group._id))){
            if(socketUser){
                
                socketUser.forEach((socketElement) => {
                    socketElement.join(group._id);
                    // Envia a mensagem para todos os "nicknames" que detenham o mesmo soulName
             
                    socketElement.emit("updateGroup", group);
                    
                });
            };
            isUserInGroup.push(resp);
        }
    } else {
        groupsExpectUsers.set(userSoul, [resp]);
    }    
}