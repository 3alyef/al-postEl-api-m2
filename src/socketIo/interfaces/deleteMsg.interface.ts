export interface DeleteGroupMsg {
    createdIn: string | string[]; 
    room: string; 
    deletedTo: string;
}

export interface DeleteDuoMsg {
    createdIn: string | string[]; 
    room: string; 
    deletedTo: "none" | "justFrom" | "all";
}