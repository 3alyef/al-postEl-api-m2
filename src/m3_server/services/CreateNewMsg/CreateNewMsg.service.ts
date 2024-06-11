import { Request, Response } from "express";
import { messageModel } from "../../db/models/Models";
import { msgsRequest } from "../../interfaces/msgsGetPrev.interface";

class CreateNewMsg {
    public async initialize(req: Request<{body: msgsRequest}>, res: Response){
        try {
            const {fromUser, deletedTo, viewStatus, toUser, message, createdIn}: msgsRequest = req.body;
            const newMsg = await this.registrerNewMsg({fromUser, deletedTo, viewStatus, toUser, message, createdIn});
            res.status(200).json(newMsg).end();
        } catch(error){
            console.log("Error: "+error);
            res.status(501).json(null).end();
        }
        
    }

    private async registrerNewMsg({fromUser, deletedTo, viewStatus, toUser, message, createdIn}: msgsRequest)  {
        
        try {
            const newMessage = new messageModel (
                {
                    fromUser,
                    deletedTo,
                    viewStatus,
                    toUser,
                    message,
                    createdIn
                }
            )

            await newMessage.save();
            return newMessage;

        } catch (error) {
            throw new Error("Ocorreu um erro ao registrar uma nova mensagem no database.");

        }
    }
}

export default CreateNewMsg;