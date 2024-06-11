import { Request, Response } from "express";
import { GetPrevMsgs } from "../../../services/Services";
import { usersRequest } from "../../../interfaces/msgsGetPrev.interface";
class PreviousMsgsController {
    public async previousPost(req: Request<{body: usersRequest}>, res: Response){
        new GetPrevMsgs().initialize(req, res);
    }
}

const previousMsgsController = new PreviousMsgsController();

export default previousMsgsController;
