import { Socket } from "socket.io";

export async function localResgistrer(userSoul: string, groupId: string, groupsExpectUsers: Map<string, string[]>, userSocketMap:Map<string, Socket[]>, isAdmin: boolean ){
    const socketUser = userSocketMap.get(userSoul);
    const isUserInGroup = groupsExpectUsers.get(userSoul)
 
    if(isUserInGroup){
        if(!isUserInGroup.includes(groupId)){
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
            isUserInGroup.push(groupId)
          
        }
    } else {
        groupsExpectUsers.set(userSoul, [groupId])
     
    }
    
     
    
}