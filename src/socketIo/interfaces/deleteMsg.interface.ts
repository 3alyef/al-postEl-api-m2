export interface DeleteGroupMsg {
    createdIn: string; 
    room: string; 
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    fromUser: string; 
    toUsers: string[]
}

export interface DeleteDuoMsg {
    createdIn: string; 
    room: string; 
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    fromUser: string; 
    toUser: string
}