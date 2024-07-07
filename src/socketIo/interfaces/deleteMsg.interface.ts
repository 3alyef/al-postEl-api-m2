import { DeletedToType } from "../services/DeleteDuoMsg/DeleteDuoMsg.service";

export interface DeleteGroupMsg {
    createdIn: string; 
    room: string; 
    deletedTo: string;
    fromUser: string; 
    toUsers: string[]
}

export interface DeleteDuoMsg {
    createdIn: string; 
    room: string; 
    deletedTo: DeletedToType;
    fromUser: string; 
    toUser: string
}