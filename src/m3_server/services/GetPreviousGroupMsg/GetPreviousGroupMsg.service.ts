import { Request, Response } from "express";
import { messageGroupModel } from "../../db/models/Models";
import { msgsResponse } from "../../interfaces/msgsSetNew.interface";
class GetPreviousGroupMsg{
    public async initialize(req: Request<{body: {group: string}}>, res: Response){      
        try{
            const {group} = req.body;
            if(group){
                const resp = await this.getPreviousMsgs(group);
                console.log("mensagens", resp);
                res.status(200).send(JSON.stringify(resp)).end();
            } else {
                res.status(401).send(JSON.stringify(null)).end();
            }
        } catch(error){
            console.log("Error ao buscar previous messages"+ error);
            res.status(500).send(JSON.stringify({ error })).end();
        }
    }

    private async getPreviousMsgs(group: string): Promise<msgsResponse[] | null>{
        try{
            const msgs: msgsResponse[] = await messageGroupModel.find({ toGroup: group }, "_id fromUser deletedTo toUsers viewStatus toGroup message createdIn");
            return msgs;
        } catch(error){       
            console.log("error ao usar model"+ error);
            return null;
        }
    }
}

export default GetPreviousGroupMsg;