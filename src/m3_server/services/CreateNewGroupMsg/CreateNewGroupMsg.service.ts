import { Request, Response } from "express";
import { messageGroupModel } from "../../db/models/Models";
import { msgsGroupRequest } from "../../interfaces/group.interface";

class CreateNewGroupMsg {
    public async initialize(req: Request<{body: msgsGroupRequest}>, res: Response){
        try {
            const {fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers}: msgsGroupRequest = req.body;
            //console.log("here =>>",fromUser, toGroup, message, createdIn);
            console.log('viewStatus', viewStatus);

            //const adjustedDeletedTo = deletedTo === "none" ? "none" : new Map(deletedTo);
            //const adjustedViewStatus = viewStatus === "onServer" ? "onServer" : new Map(viewStatus);
            //console.log('///', adjustedDeletedTo, adjustedViewStatus)
            const newMsg = await this.registrerNewMsg({fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers});
            res.status(200).json(newMsg).end();
        } catch(error){
            console.log("Error: "+error);
            res.status(501).json(null).end();
        }
        
    }

    private async registrerNewMsg({fromUser, deletedTo, viewStatus, toGroup, message, createdIn, toUsers}: msgsGroupRequest){
        let deletedToV;
        if(deletedTo !== "none"){
            deletedToV = JSON.stringify(deletedTo);
        }
        
        try {
            const newGroupMessage = new messageGroupModel (
                {
                    createdIn,
                    deletedTo: deletedToV || deletedTo,
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