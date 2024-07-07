import { messageModel } from "../../../m3_server/db/models/Models";
import { DeleteDuoMsg as DeleteMsg} from "../../interfaces/deleteMsg.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";
import { changeDeletedTo } from "../../routes/controllers/DeleteMsgController/DeleteMsgController";

export type DeletedToType =  "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";

class DeleteDuoMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUser}: DeleteMsg, previousMessages: Map<string, msgsResponse[]>): Promise<DeletedToType>{

        let newValue = await this.updateMsgOnServer_messageModel(createdIn, deletedTo, previousMessages, room);

        await this.deleteMsg_messageModel({createdIn, deletedTo: newValue, fromUser, toUser});
        return newValue;
    }
    
    private async updateMsgOnServer_messageModel(createdIn: string, deletedTo: DeletedToType, previousMessages: Map<string, msgsResponse[]>, room: string): Promise<DeletedToType>{
        const msgs = previousMessages.get(room);

        let newDeletedTo: DeletedToType = "none";

        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    //msg.deletedTo = deletedTo;
                    newDeletedTo = changeDeletedTo(msg.deletedTo, deletedTo);
                    console.log("newDeletedTo", newDeletedTo)
                    msg.deletedTo = newDeletedTo;
                }
            })
        }

        return newDeletedTo;
    }
    private async deleteMsg_messageModel(
        {createdIn, deletedTo, fromUser, toUser}: {createdIn: string, deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo", fromUser: string, toUser: string}
    ) {
        try {
            
            const updateResult = await messageModel.updateOne(
                { createdIn, fromUser, toUser },
                { $set: { deletedTo: deletedTo } }
            );

            //console.log("Atualização realizada com sucesso: ", updateResult);
            if (updateResult.modifiedCount > 0) {
                return;
            }
            throw { error: "Erro ao atualizar Msg" + updateResult };
        } catch (error) {
            console.log("Error: ", error)
        }
    }
}

export const deleteDuoMsg = new DeleteDuoMsg();