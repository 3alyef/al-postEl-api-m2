import { messageGroupModel } from "../../../m3_server/db/models/Models";
import { DeleteGroupMsg as DeleteGpMsg } from "../../interfaces/deleteMsg.interface";
import { msgsGroupDB } from "../../interfaces/group.interface";
import { changeDeletedTo } from "../../routes/controllers/DeleteMsgController/DeleteMsgController";
import {  DeletedToTypeGroup } from '../DeleteDuoMsg/DeleteDuoMsg.service';
class DeleteGroupMsg {
    public async delete({room, createdIn, deletedTo, fromUser, toUsers}: DeleteGpMsg, previousGroupMessages: Map<string, msgsGroupDB[]>): Promise<DeletedToTypeGroup>{

        let newValue = await this.updateMsgOnServer_messageGroupModel(createdIn, deletedTo, previousGroupMessages, room);

        await this.deleteMsg_messageGroupModel({room, createdIn, deletedTo: newValue.deletedTo, fromUser, toUsers});
        
        return newValue;
        
    }

    private async deleteMsg_messageGroupModel(
        {room, createdIn, deletedTo, fromUser, toUsers}: {room: string, createdIn: string, deletedTo: "none" | "justFrom" | "all" | "allFrom" | string, fromUser: string, toUsers: string[]}
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

    private async updateMsgOnServer_messageGroupModel(createdIn: string, deletedTo: "none" | "justFrom" | "all" | "allFrom" | string, previousGroupMessages: Map<string, msgsGroupDB[]>, room: string): Promise<DeletedToTypeGroup>{
        const msgs = previousGroupMessages.get(room);
        //let newDeletedTo:DeletedToTypeGroup = {deletedTo: "none"};
        if(msgs) {
            msgs.forEach((msg)=>{
                if(msg.createdIn === createdIn) {
                    //msg.deletedTo = deletedTo;
                    //newDeletedTo = changeDeletedTo({deletedTo: msg.deletedTo}, {deletedTo});
                    //newDeletedTo = {deletedTo};
                    msg.deletedTo = deletedTo;
                }
            })
        }
        return {deletedTo};
    }
}

export const deleteGroupMsg = new DeleteGroupMsg();