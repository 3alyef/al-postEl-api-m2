import { Request, Response } from "express";
import { newGroup } from "../../../interfaces/group.interface";
import { CreateNewGroup } from "../../../services/Services";
class SetNewGroupController {
    public async newGroupPost(req: Request, res: Response){
        const group: newGroup = req.body;
        console.log(group)
        
        new CreateNewGroup().initialize(res, group);
    }

}

const setNewGroupController = new SetNewGroupController();

export default setNewGroupController;