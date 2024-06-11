import { Request, Response } from "express";
import { messageModel } from "../../db/models/Models";
import { msgsResponse as msgsDB, msgsResponse } from "../../interfaces/msgsSetNew.interface";
import { usersRequest } from "../../interfaces/msgsGetPrev.interface";

export function ordeMsgsByData(msgs: msgsDB[]): msgsDB[] {
    return msgs.sort((a, b) => Date.parse(a.createdIn) - Date.parse(b.createdIn))
};

class GetPrevMsgs {
    public async initialize(req: Request<{body: usersRequest}>, res: Response){
        try{
            const {userA, userB} = req.body;
            if(userA && userB){
                const msgs: msgsDB[] | null = await this.findMessages(userA, userB);
                if(msgs){
                    
                    const msgsOrdened: msgsDB[] = ordeMsgsByData(msgs);
                    const respToSend = JSON.stringify(msgsOrdened)
                    console.log('here', respToSend)
                    res.status(200).send(respToSend).end();
                } else {
                    res.status(200).send(null).end();
                }
                
            } else {
                res.status(401).send(JSON.stringify(null)).end();
            }
        } catch(error){
            console.log("Error ao buscar previous messages"+ error);
            res.status(500).send(JSON.stringify({ error })).end();
        }
        
    }

    private async findMessages(userA: string, userB: string): Promise<msgsDB[] | null>{
        try{
            const messagesFromAToB: msgsDB[] = await messageModel.find({ fromUser: userA, toUser: userB }, "_id fromUser deletedTo viewStatus toUser message createdIn");

            const messagesFromBToA: msgsDB[] = await messageModel.find({ fromUser: userB, toUser: userA }, "_id fromUser deletedTo viewStatus toUser message createdIn");

            let msg: msgsResponse[] = [...messagesFromAToB, ...messagesFromBToA];
            return msg
        } catch(error){       
            console.log("error ao usar model"+ error)
            return null
        }
        
    }
}

export default GetPrevMsgs;