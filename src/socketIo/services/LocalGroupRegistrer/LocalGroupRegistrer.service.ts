import { Socket } from "socket.io";
import { newGroupResponse } from "../../interfaces/group.interface";
export interface propsGroupsRes {
    _id: string;
    imageData: {userImage: string | undefined, lastUpdateIn: string | undefined}
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[]
}
export async function localResgistrer(userSoul: string, groupsExpectUsers: Map<string, newGroupResponse[]>, userSocketMap:Map<string, Socket[]>, group: propsGroupsRes ){
    const socketsUser = userSocketMap.get(userSoul);
    const isUserInGroup = groupsExpectUsers.get(userSoul);
    console.log('isUserInGroup: ', isUserInGroup);
    //const have = 
    console.log('hhhhhhhine',isUserInGroup?.filter((obj) => obj._id === group._id))
    if(!isUserInGroup || isUserInGroup.filter((obj) => obj._id === group._id)){
        console.log("!isUserInGroup || !isUserInGroup.filter((obj) => obj._id === group._id")
        if(socketsUser){
            console.log('if(!isUserInGroup.filter((obj) => obj._id === group._id))');

            socketsUser.forEach((socketElement) => {
                socketElement.join(group._id);
                // Envia a mensagem para todos os "nicknames" que detenham o mesmo soulName
                socketElement.emit("updateGroup", group);
            });
        };
        
    } 
    if(!isUserInGroup){
        groupsExpectUsers.set(userSoul, [group])
    } else {
        isUserInGroup.push(group)
    }
}