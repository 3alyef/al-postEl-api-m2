import { messageGroupModel } from "../../../m3_server/db/models/Models";
import { DeleteGroupMsg as DeleteGpMsg } from "../../interfaces/deleteMsg.interface";
import { msgsGroupDB } from "../../interfaces/group.interface";
class DeleteGroupMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUsers}: DeleteGpMsg, previousGroupMessages: Map<string, msgsGroupDB[]>){

        await this.updateMsgOnServer_messageGroupModel(createdIn, deletedTo, previousGroupMessages, room);

        await this.deleteMsg_messageGroupModel({room, createdIn, deletedTo, fromUser, toUsers});
    }

    private async deleteMsg_messageGroupModel(
        {room, createdIn, deletedTo, fromUser, toUsers}: {room: string, createdIn: string, deletedTo: string, fromUser: string, toUsers: string[]}
    ) {
        try {
            const updateResult = await messageGroupModel.updateMany(
                { toGroup: room, createdIn: createdIn, toUsers, fromUser },
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

    private async updateMsgOnServer_messageGroupModel(createdIn: string, deletedTo: string, previousGroupMessages: Map<string, msgsGroupDB[]>, room: string) {
        const msgs = previousGroupMessages.get(room);
        //let newDeletedTo:DeletedToTypeGroup = {deletedTo: "none"};
        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    msg.deletedTo = deletedTo;
                }
            })
        }
    }
}

export const deleteGroupMsg = new DeleteGroupMsg();