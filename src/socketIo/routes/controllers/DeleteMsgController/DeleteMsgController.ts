import { Socket } from "socket.io";
import { DeleteDuoMsg, DeleteGroupMsg } from "../../../interfaces/deleteMsg.interface";
import { DeleteDuoMsg as DeleteServMsg, DeleteGroupMsg as DeleteGpMsg} from "../../../services/Services";
import { msgsResponse } from "../../../interfaces/msgs.interface";
import { msgsGroupDB } from "../../../interfaces/group.interface";

class DeleteMsgController {
    private deleteMsg: DeleteServMsg;
    private deleteGpMsg: DeleteGpMsg;
    constructor() {
        this.deleteMsg = new DeleteServMsg();
        this.deleteGpMsg = new DeleteGpMsg();
    }
    public async deleteDuoMsg(socket: Socket, routeName: string,
    previousMessages: Map<string, msgsResponse[]>) {
        socket.on(routeName, (msgData: DeleteDuoMsg)=>{
            this.deleteMsg.delete(msgData, previousMessages);
        })
    }

    public async deleteGroupMsg(socket: Socket, routeName: string, previousGroupMessages: Map<string, msgsGroupDB[]>) {
        socket.on(routeName, (msgGroupData: DeleteGroupMsg)=>{
            console.log("msgGroupData", msgGroupData)
            this.deleteGpMsg.delete(msgGroupData, previousGroupMessages)
        })
    }
}

export const deleteMsgController = new DeleteMsgController();
