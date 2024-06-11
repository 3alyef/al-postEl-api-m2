export interface msgsRequest {
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all";
    viewStatus: "onServer" | "delivered" | "seen";
    toUser: string;
    message: string;
    createdIn: string;
}

export interface msgsUpdateStatusRequest {
    fromUser: string;
    toUser: string;
    createdIn: string;
    viewStatus: "onServer" | "delivered" | "seen";
}

export interface usersRequest{
    userA: string;
    userB: string;
}