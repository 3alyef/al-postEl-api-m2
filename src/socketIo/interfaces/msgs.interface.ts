export interface msgsResponse {
    _id?: string;
    fromUser: string;
    toUser: string;
    toChannel?: string;
    msg: string;
    createdIn: string;
}

export interface msgsRequest {
    userA: string;
    userB: string;
}

export interface sendMsg {
    fromUser: string;
    toUser: string;
    toRoom: string;
    msg: string;
    isGroup: string;
    chatName: string;
}