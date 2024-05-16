export interface msgsResponse {
    _id?: string;
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all";
    toUser: string;
    toChannel?: string;
    message: string;
    createdIn: string;
}

export interface msgsRequest {
    userA: string;
    userB: string;
}

export interface sendMsg {
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all";
    toUser: string;
    toRoom?: string;
    message: string;
    isGroup: string;
    chatName: string;
    toGroup?: string;
    createdIn: string
}