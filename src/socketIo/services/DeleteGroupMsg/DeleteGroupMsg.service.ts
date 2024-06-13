import { messageGroupModel } from "../../../m3_server/db/models/Models";
import { DeleteGroupMsg as DeleteGpMsg } from "../../interfaces/deleteMsg.interface";
import { msgsGroupDB } from "../../interfaces/group.interface";
class DeleteGroupMsg {
    public async delete({room, createdIn, deletedTo}: DeleteGpMsg, previousGroupMessages: Map<string, msgsGroupDB[]>){
        if(Array.isArray(createdIn)){
            createdIn.forEach(async (msgCIN)=>{
                await this.deleteMsg_messageGroupModel({createdIn: msgCIN, deletedTo});
                await this.updateMsgOnServer_messageGroupModel(msgCIN, deletedTo, previousGroupMessages, room);
            })
        } else {
            await this.deleteMsg_messageGroupModel({createdIn, deletedTo});
            await this.updateMsgOnServer_messageGroupModel(createdIn, deletedTo, previousGroupMessages, room);
        }
    }

    private async deleteMsg_messageGroupModel(
        {createdIn, deletedTo}: {createdIn: string, deletedTo: string}
    ) {
        try {
            const updateResult = await messageGroupModel.updateMany(
                { createdIn: createdIn },
                { $set: { deletedTo: deletedTo } }
            );

            //console.log("Atualização realizada com sucesso: ", updateResult);
            if (updateResult.modifiedCount > 0) {
                return;
            }
            throw { error: "Erro ao atualizar Msg" };
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    private async updateMsgOnServer_messageGroupModel(createdIn: string, deletedTo: string, previousGroupMessages: Map<string, msgsGroupDB[]>, room: string){
        const msgs = previousGroupMessages.get(room);
        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    msg.deletedTo = deletedTo;
                }
            })
        }
    }
}

export default DeleteGroupMsg; 