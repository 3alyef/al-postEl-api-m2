import {Request, Response} from "express";
import { FindGroups } from "../../../services/Services";
class PreviousGroupsController {
    public async previousGroupsPost(req: Request, res: Response){
        try {
            const { user } = req.body;
            const data = await new FindGroups().initialize(user);
            if(data){
                res.status(200).json(data).end();
            }else {
                res.status(500).end()
            }
            
        } catch(error){
            console.error(error);
            res.status(500).json({error}).end()
        }
    }
}

const previousGroupsController = new PreviousGroupsController()

export default previousGroupsController;