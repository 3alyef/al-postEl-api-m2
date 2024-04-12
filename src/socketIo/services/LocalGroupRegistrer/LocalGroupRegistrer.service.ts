import { Socket } from "socket.io";
import { newGroupResponse } from "../../interfaces/group.interface";

export async function localResgistrer(userSoul: string, resp: newGroupResponse, groupId: string, groupsExpectUsers: Map<string, newGroupResponse[]>, userSocketMap:Map<string, Socket[]>, isAdmin: boolean ){
    const socketUser = userSocketMap.get(userSoul);
    const isUserInGroup = groupsExpectUsers.get(userSoul)
 
    if(isUserInGroup){//includes(groupId)
        if(!isUserInGroup.some(obj => obj._id.includes(groupId))){
            if(socketUser){
                
                socketUser.forEach((socketElement) => {
                    socketElement.join(groupId);
                    // Envia a mensagem para todos os "nicknames" que detenham o mesmo soulName
                    
                    if(isAdmin){
                 
                        socketElement.emit("updateGroup", {group: groupId, isAdmin: true}) 
                    } else {
                 
                        socketElement.emit("updateGroup", {group: groupId, isAdmin: false}) 
                    }
                    
                    
                });
                
            } 
            isUserInGroup.push(resp)
          
        }
    } else {
        groupsExpectUsers.set(userSoul, [resp])
     
    }
    
     
    
}