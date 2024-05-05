import { Request, Response } from "express";
import { Unregister } from "../../../services/Services";
import { unregisterRequest } from "../../../interfaces/unregister.interface";

class UnregisterController {
    postUnregister(req: Request<{body: unregisterRequest}>, res: Response){
        new Unregister().initialize(req, res);
    }
}


const unregisterController = new UnregisterController();

export { unregisterController };