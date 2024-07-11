import { Request, Response } from "express";
import { msgsUpdateStatusRequest } from "../../interfaces/msgsGetPrev.interface";
import { messageGroupModel } from "../../db/models/Models";
export interface PropsReqUp {
    fromUser: string, 
    toUsers: string[], 
    viewStatus: string, 
    createdIn: string
}
export async function UpdateGroupMsgStatus(req: Request<{body: msgsUpdateStatusRequest}>, res: Response){
    try {
        const {fromUser, toUsers, viewStatus, createdIn}: PropsReqUp = req.body;
        console.log("update ViewStatus Message Group: ", viewStatus)
        const newMsg = await updateStatusMsg({fromUser, toUsers, viewStatus, createdIn});
        console.log({fromUser, toUsers, viewStatus, createdIn})
        res.status(200).json(newMsg).end();
    } catch(error){
        console.log("Error: "+error);
        res.status(501).json(null).end();
    }
}

async function updateStatusMsg({fromUser, toUsers, createdIn, viewStatus}: PropsReqUp) {
    try {
        const result = await messageGroupModel.updateOne(
            { 
                fromUser, 
                toUsers, 
                createdIn 
            },
            { $set: { viewStatus } }
        )

        if (result.modifiedCount === 0) {
            throw new Error("Nenhuma mensagem encontrada para atualizar com o createdIn especificado.");
        }

        return { success: true, message: "Status da mensagem atualizado com sucesso." };

    } catch (error) {
        throw new Error("Ocorreu um erro ao atualizar o status da mensagem no database: " + error);

    }
}
