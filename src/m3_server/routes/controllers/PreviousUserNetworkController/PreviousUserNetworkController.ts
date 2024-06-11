import { Request, Response } from "express";
import { GetPrevUserNetwork } from "../../../services/Services";

class PreviousUserNetworkController {
    public async previousUserNetworkPost(req: Request<{body: userNetworkGetRequest}>, res: Response){
        new GetPrevUserNetwork().initialize(req, res)
    }
}

const previousUserNetworkController = new PreviousUserNetworkController();

export default previousUserNetworkController;
