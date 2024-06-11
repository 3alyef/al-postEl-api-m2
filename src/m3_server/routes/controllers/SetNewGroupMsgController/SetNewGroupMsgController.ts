import { Request, Response } from "express";
import { CreateNewGroupMsg, UpdateGroupMsgStatus } from "../../../services/Services";
import { msgsGroupRequest } from "../../../interfaces/group.interface";
import { msgsUpdateStatusRequest } from "../../../interfaces/msgsGetPrev.interface";

class SetNewGroupMsgController {
    public async newGroupMsgPost(req: Request<{body: msgsGroupRequest}>, res: Response){
        new CreateNewGroupMsg().initialize(req, res);    
    }
    public async setStatusGroupMsgPost(req: Request<{body: msgsUpdateStatusRequest}>, res: Response){
        UpdateGroupMsgStatus(req, res)
    }
}

const setNewGroupMsgController = new SetNewGroupMsgController();

export default setNewGroupMsgController;