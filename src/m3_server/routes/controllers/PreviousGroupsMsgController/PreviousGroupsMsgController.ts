import { Request, Response } from "express";
import { GetPreviousGroupMsg } from "../../../services/Services";

class PreviousGroupsMsgController {
    public async previousGroupMsgPost(req: Request<{body:{group:string}}>, res: Response){
        await new GetPreviousGroupMsg().initialize(req, res);
    }
}

const previousGroupsMsgController = new PreviousGroupsMsgController();

export default previousGroupsMsgController;