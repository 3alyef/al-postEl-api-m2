import { messageModel } from "../../../m3_server/db/models/Models";
import { DeleteDuoMsg as DeleteMsg} from "../../interfaces/deleteMsg.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";

class DeleteDuoMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUser}: DeleteMsg, previousMessages: Map<string, msgsResponse[]>){
        await this.deleteMsg_messageModel({createdIn, deletedTo, fromUser, toUser});
        await this.updateMsgOnServer_messageModel(createdIn, deletedTo, previousMessages, room);
        return;
    }

    private async deleteMsg_messageModel(
        {createdIn, deletedTo, fromUser, toUser}: {createdIn: string, deletedTo: "none" | "justFrom" | "justAll" | "justTo" | "all", fromUser: string, toUser: string}
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

    private async updateMsgOnServer_messageModel(createdIn: string, deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all", previousMessages: Map<string, msgsResponse[]>, room: string){
        const msgs = previousMessages.get(room);
        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    msg.deletedTo = deletedTo
                }
            })
        }
    }
}

export default DeleteDuoMsg; 