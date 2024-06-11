import { Request, Response } from "express";
import { CreateNewMsg, UpdateMsgStatus } from "../../../services/Services";
import { msgsRequest, msgsUpdateStatusRequest } from "../../../interfaces/msgsGetPrev.interface";

class SetNewMsgController {
    public async newMsgPost(req: Request<{body: msgsRequest}>, res: Response){     
        new CreateNewMsg().initialize(req, res);    
    }
    public async setStatusMsgPost(req: Request<{body: msgsUpdateStatusRequest}>, res: Response){
        UpdateMsgStatus(req, res)
    }
}

const setNewMsgController = new SetNewMsgController();

export default setNewMsgController;
