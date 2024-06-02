export interface newGroup {
    //groupImage?: {image: File, type: string, name: string}
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants?: string[]
}

export interface newGroupResponse {
    _id: string;
    imageData: {userImage: string | undefined, lastUpdateIn: string | undefined};
    __v: number;
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



export interface msgsGroupDB {
    _id?: string;
    fromUser: string;
    deletedTo: "none" | "justFrom" | "all";
    viewStatus: "onServer" | "delivered" | "seen";
    toGroup: string;
    message: string;
    createdIn: string;
}