import { messageModel } from "../../../m3_server/db/models/Models";
import { DeleteDuoMsg as DeleteMsg} from "../../interfaces/deleteMsg.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";
import { changeDeletedTo } from "../../routes/controllers/DeleteMsgController/DeleteMsgController";

export interface DeletedToType {
    deletedTo:"none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo"
}
export interface DeletedToTypeGroup {
    deletedTo: "none" | "justFrom" | "all" | "allFrom" | string;
}
class DeleteDuoMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUser}: DeleteMsg, previousMessages: Map<string, msgsResponse[]>): Promise<DeletedToType>{

        let newValue = await this.updateMsgOnServer_messageModel(createdIn, {deletedTo}, previousMessages, room);

        await this.deleteMsg_messageModel({createdIn, deletedTo: newValue.deletedTo, fromUser, toUser});
        return newValue;
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

    private async updateMsgOnServer_messageModel(createdIn: string, {deletedTo}: DeletedToType, previousMessages: Map<string, msgsResponse[]>, room: string): Promise<DeletedToType>{
        const msgs = previousMessages.get(room);

        let newDeletedTo:DeletedToType = {deletedTo: "none"};

        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    //msg.deletedTo = deletedTo;
                    newDeletedTo = changeDeletedTo({deletedTo: msg.deletedTo}, {deletedTo});
                    console.log("newDeletedTo", newDeletedTo.deletedTo)
                    msg.deletedTo = newDeletedTo.deletedTo;
                }
            })
        }

        return newDeletedTo;
    }

    
}

export const deleteDuoMsg = new DeleteDuoMsg();