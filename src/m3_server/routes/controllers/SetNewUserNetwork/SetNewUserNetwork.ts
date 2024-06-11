import { Request, Response } from "express";
import { CreateNewUserNetwork } from "../../../services/Services";
import { networkRequest } from "../../../interfaces/userNetworkSetNew.interface";

class SetNewUserNetworkController {
    public async newUserNetworkPost(req: Request<{body: networkRequest}>, res: Response){     
        new CreateNewUserNetwork().initialize(req, res);
    }
}

const setNewUserNetworkController = new SetNewUserNetworkController();

export default setNewUserNetworkController;
