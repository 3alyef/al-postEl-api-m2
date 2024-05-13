import { Socket } from 'socket.io';
import { msgsResponse } from '../../interfaces/msgs.interface';
class SendMsg {
    public async initialize(socket: Socket, previousMessages: Map<string, msgsResponse[]>, fromUser: string, toUser: string, toRoom: string, message: string, createdIn: string){
        const dateInf = new Date(); 
        const data = dateInf.toISOString();
        const content: msgsResponse = {  
            fromUser,
            toUser,
            message, 
            createdIn
        }
        
        const roomObj = previousMessages.get(toRoom);
        if(!roomObj){
            const roomObj: msgsResponse[] = [];
            previousMessages.set(toRoom, roomObj);
        }
        roomObj?.push(content);
        console.log('roomObj', roomObj);
        //console.log(toRoom)
        this.sendMessagesToM3(content)
        socket.to(toRoom).emit("newMsg", {messageData: content, room:toRoom});  
        
    }

    private async sendMessagesToM3(content: msgsResponse){
        const body = JSON.stringify(content);
        const response = await fetch(`${process.env.URL_M3}/setNewMsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        console.log(response)
    }
}

export default SendMsg;