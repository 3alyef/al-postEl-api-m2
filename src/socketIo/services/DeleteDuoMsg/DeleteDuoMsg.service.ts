import { messageModel } from "../../../m3_server/db/models/Models";
import { DeleteDuoMsg as DeleteMsg} from "../../interfaces/deleteMsg.interface";
import { msgsResponse } from "../../interfaces/msgs.interface";

class DeleteDuoMsg {
    public async delete({room, createdIn, deletedTo}: DeleteMsg, previousMessages: Map<string, msgsResponse[]>){
        if(Array.isArray(createdIn)){
            createdIn.forEach(async (msgCIN)=>{
                await this.deleteMsg_messageModel({createdIn: msgCIN, deletedTo});
                await this.updateMsgOnServer_messageModel(msgCIN, deletedTo, previousMessages, room);
            })
        } else {
            await this.deleteMsg_messageModel({createdIn, deletedTo});
            await this.updateMsgOnServer_messageModel(createdIn, deletedTo, previousMessages, room);
        }
    }

    private async deleteMsg_messageModel(
        {createdIn, deletedTo}: {createdIn: string, deletedTo: "none" | "justFrom" | "all"}
    ) {
        try {
            const updateResult = await messageModel.updateMany(
                { createdIn: createdIn },
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

    private async updateMsgOnServer_messageModel(createdIn: string, deletedTo: "none" | "justFrom" | "all", previousMessages: Map<string, msgsResponse[]>, room: string){
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