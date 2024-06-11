import { groupModel } from "../../db/models/Models";
import { newGroup } from "../../interfaces/group.interface";
import { Response } from "express";
class CreateNewGroup {
    public async initialize(res: Response, group: newGroup){
        const response = await this.createNewGroup(group);
        console.log(response);
        res.status(201).json(response).end();
    }

    private async createNewGroup(group: newGroup){
        try {
            const newGroup = new groupModel (
                {
                    groupName: group.groupName,
                    groupParticipants: group.groupParticipants,
                    groupAdministratorParticipants: group.groupAdministratorParticipants
                }
            )

            await newGroup.save();
            return newGroup;

        } catch (error) {
            throw new Error("Ocorreu um erro ao registrar um novo grupo: "+ error);

        }
    }
}

export default CreateNewGroup;