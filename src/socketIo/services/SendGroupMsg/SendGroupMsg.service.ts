import { Socket } from 'socket.io';
import { msgsGroupDB } from '../../interfaces/group.interface';
class SendGroupMsg {
    public async initialize(socket: Socket, previousGroupMessages: Map<string, msgsGroupDB[]>, fromUser: string, toGroup: string, message: string, createdIn: string){
        const content: msgsGroupDB = {  
            fromUser,
            message,
            toGroup,
            createdIn
        }
        
        let roomObj = previousGroupMessages.get(toGroup);
        if(!roomObj){
            roomObj = [];
            previousGroupMessages.set(toGroup, roomObj);
        }
        roomObj?.push(content);
        console.log(roomObj);
        socket.to(toGroup).emit("newMsg", {messageData: content, room:toGroup});  
        this.sendMessagesToM3(content)
    }

    private async sendMessagesToM3(content: msgsGroupDB){
        const body = JSON.stringify(content);
        const response = await fetch(`${process.env.URL_M3}/setNewGroupMsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        console.log(response)
    }
}

export default SendGroupMsg;