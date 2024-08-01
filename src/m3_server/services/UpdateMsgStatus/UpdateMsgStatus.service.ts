import { Request, Response } from "express";
import { messageModel } from "../../db/models/Models";
import { msgsUpdateStatusRequest } from "../../interfaces/msgsGetPrev.interface";

export async function UpdateMsgStatus(req: Request<{body: msgsUpdateStatusRequest}>, res: Response){
    try { 
        const {fromUser, toUser, viewStatus, createdIn}: msgsUpdateStatusRequest = req.body;
        const newMsg = await updateStatusMsg({fromUser, toUser, viewStatus, createdIn});
        //console.log({fromUser, toUser, viewStatus, createdIn})
        res.status(200).json(newMsg).end();
    } catch(error){
        console.log("Error: "+error);
        res.status(501).json(null).end();
    }
}

async function updateStatusMsg({fromUser, toUser, createdIn, viewStatus}: msgsUpdateStatusRequest) {
    try {
        const result = await messageModel.updateOne(
            { 
                fromUser,
                toUser, 
                createdIn 
            },
            { $set: { viewStatus } }
        )

        if (result.modifiedCount === 0) {
            throw {msg: "Nenhuma mensagem encontrada para atualizar com o createdIn especificado."}
        }

        return { success: true, message: "Status da mensagem atualizado com sucesso." };

    } catch (error ) {
        let errorMsg = error as {msg: string};
        throw new Error("Ocorreu um erro ao atualizar o status da mensagem no database: " + errorMsg.msg); 
    }
}
