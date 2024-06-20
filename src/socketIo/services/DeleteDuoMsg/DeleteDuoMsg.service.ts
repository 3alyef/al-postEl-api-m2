import { messageModel } from "../../../m3_server/db/models/Models";
import { DeleteDuoMsg as DeleteMsg} from "../../interfaces/deleteMsg.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";
import { changeDeletedTo } from "../../routes/controllers/DeleteMsgController/DeleteMsgController";

export interface DeletedToType {
    deletedTo:"none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo"
}
class DeleteDuoMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUser}: DeleteMsg, previousMessages: Map<string, msgsResponse[]>){

        let newValue = await this.updateMsgOnServer_messageModel(createdIn, {deletedTo}, previousMessages, room);

        await this.deleteMsg_messageModel({createdIn, deletedTo: newValue.deletedTo, fromUser, toUser});
        return;
    }

    private async deleteMsg_messageModel(
        {createdIn, deletedTo, fromUser, toUser}: {createdIn: string, deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo", fromUser: string, toUser: string}
    ) {
        try {
            const updateResult = await messageModel.updateMany(
                { createdIn, fromUser, toUser },
                { $set: { deletedTo: deletedTo } }
            );

            //console.log("Atualização realizada com sucesso: ", updateResult);
            if (updateResult.modifiedCount > 0) {
                return;
            }
            throw { error: "Erro ao atualizar Msg" };
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    private async updateMsgOnServer_messageModel(createdIn: string, {deletedTo}: DeletedToType, previousMessages: Map<string, msgsResponse[]>, room: string): Promise<DeletedToType>{
        const msgs = previousMessages.get(room);

        let newDeletedTo:DeletedToType = {deletedTo: "none"};

        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    //msg.deletedTo = deletedTo;
                    newDeletedTo = changeDeletedTo({deletedTo: msg.deletedTo}, {deletedTo});
                }
            })
        }

        return newDeletedTo;
    }

    
}

export const deleteDuoMsg = new DeleteDuoMsg();