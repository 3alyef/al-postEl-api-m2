export interface newGroup {
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[]
}

export interface msgsGroupRequest {
    fromUser: string;
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all" | "allFrom" | "allTo";
    toUsers: string[];
    viewStatus?: "onServer" | Map<string, "delivered" | "seen">;
    message: string;
    toGroup: string;
    createdIn: string
}
