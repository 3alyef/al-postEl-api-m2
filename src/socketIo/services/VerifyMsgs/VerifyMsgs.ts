import { msgsGroupDB } from "../../interfaces/group.interface";
import { DeletedToType } from "../DeleteDuoMsg/DeleteDuoMsg.service";
import { stringToMap } from "../RestoreGroup/RestoreGroup.service";

class VerifyMsgs {
    verifyGroupMsgs(msgs: msgsGroupDB[], userSoul: string): msgsGroupDB[]{
        
        msgs.forEach((msg)=>{
            let deletedToMap = stringToMap<string, DeletedToType>(msg.deletedTo);
            
            deletedToMap.forEach((del, Soul)=>{
                if(msg.message.length > 0){
                    if(del === "all" || del === "allFrom" || del === "allTo"){

                        msg.message = "";
                    } else if(msg.fromUser === userSoul && del === "justFrom"){

                        msg.message = "";
                    } else if(Soul === msg.fromUser && msg.fromUser === userSoul && del === "justTo") {

                        msg.message = "";
                    }
                }
                
            })
        })
        return msgs;
    }
}
let verifyMsgs = new VerifyMsgs();
export default verifyMsgs;