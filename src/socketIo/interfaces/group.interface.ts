export interface newGroup {
    //groupImage?: {image: File, type: string, name: string}
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants?: string[]
}

export interface newGroupResponse {
    _id: string;
    imageData: {userImage: string | undefined, lastUpdateIn: string | undefined};
    __v?: number;
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[];
   

}

export interface groupDB {
    _id: string;
    fromUser: string;
    group: string;
    createdIn: string;
}

export interface msgsGroupFromDB {
    _id?: string;
    fromUser: string;
    deletedTo: string;
    toUsers: string[];
    viewStatus: string;
    message: string;
    toGroup: string;
    createdIn: string
}
export type ViewStatus = "none" | "onServer" | "delivered" | "seen"
export interface msgsGroupDB {
    _id?: string;
    fromUser: string;
    deletedTo: string;
    // string =>> Map<string, "allTo" | "justTo">();
    //| "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo"
    toUsers: string[];
    viewStatus: string;
    message: string;
    toGroup: string;
    createdIn: string
}

export interface msgsGroupDBRequest {
    _id?: string;
    fromUser: string;
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    toUsers: string[];
    viewStatus: string;
    message: string;
    toGroup: string;
    createdIn: string
}