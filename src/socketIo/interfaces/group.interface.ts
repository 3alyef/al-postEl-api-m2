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
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    toUsers: string[];
    viewStatus?: any;
    message: string;
    toGroup: string;
    createdIn: string
}

export interface msgsGroupDB {
    _id?: string;
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all" | "allFrom" | string;
    // string =>> Map<string, "allTo" | "justTo">();
    //| "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo"
    toUsers: string[];
    viewStatus?: string;
    message: string;
    toGroup: string;
    createdIn: string
}

export interface msgsGroupDBRequest {
    _id?: string;
    fromUser: string;
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    toUsers: string[];
    viewStatus?: "onServer" | Map<string, "delivered" | "seen">;
    message: string;
    toGroup: string;
    createdIn: string
}