import { groupModel } from "../../db/models/Models";
import { GroupsProps } from "../../interfaces/msgsSetNew.interface";

class FindGroups {
    public async initialize(userSoul: string){
        const resp = await this.findGroups(userSoul);
        return resp
    }

    private async findGroups(userSoul: string){
        const groups: GroupsProps[] = await groupModel.find({ groupParticipants: userSoul}, "_id groupName groupParticipants groupAdministratorParticipants");
        console.log("grupos", groups)
        return groups
    }
}
export default FindGroups;