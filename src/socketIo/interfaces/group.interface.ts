export interface newGroup {
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants?: string[]
}

export interface newGroupResponse {
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[];
    _id: string;
    __v: number

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
    isDeletedToFrom: boolean;
    toGroup: string;
    message: string;
    createdIn: string;
}