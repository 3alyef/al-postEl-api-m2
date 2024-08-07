import { Request, Response } from "express";
import { messageGroupModel } from "../../db/models/Models";
import { msgsGroupRequest } from "../../interfaces/group.interface";

class CreateNewGroupMsg {
    public async initialize(req: Request<{body: msgsGroupRequest}>, res: Response){
        try {
            const {fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers}: msgsGroupRequest = req.body;
            const newMsg = await this.registrerNewMsg({fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers});
            res.status(200).json(newMsg).end();
        } catch(error){
            console.log("Error: "+error);
            res.status(501).json(null).end();
        }
        
    }

    private async registrerNewMsg({fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers}: msgsGroupRequest){
        
        try {
            const newGroupMessage = new messageGroupModel (
                {
                    createdIn,
                    deletedTo,
                    fromUser,
                    message,
                    toGroup,
                    toUsers,
                    viewStatus
                }
            );
            await newGroupMessage.save();
            return newGroupMessage;

        } catch (error) {
            throw new Error("Ocorreu um erro ao registrar uma nova mensagem no database." + error);

        }
    }

    
}

export default CreateNewGroupMsg;