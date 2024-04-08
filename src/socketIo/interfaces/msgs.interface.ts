export interface msgsResponse {
    fromUser: string;
    toUser: string;
    msgs: string;
    createdIn: string;
}

export interface msgsRequest {
    userA: string;
    userB: string;
}

export interface sendMsg {
    content: string, 
    to: string,
    sender: string,
    chatName: string,
    isChannel: boolean
}