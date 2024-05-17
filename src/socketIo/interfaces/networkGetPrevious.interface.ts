export interface networksDB {
    _id: string;
    user: string;
    friend: string;
    createdIn: string;
}

export interface msgsDB {
    _id: string;
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all";
    viewStatus: "onServer" | "delivered" | "seen";
    toUser: string;
    message: string;
    createdIn: string;
}