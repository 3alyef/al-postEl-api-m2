export interface newGroup {
    groupName: string;
    groupParticipants: string[];
    groupAdministratorParticipants: string[]
}

export interface msgsGroupRequest {
    fromUser: string;
    deletedTo: "none" | Map<string, "justTo" | "justFrom" | "all">;
    toUsers: string[];
    viewStatus?: "onServer" | Map<string, "delivered" | "seen">;
    message: string;
    toGroup: string;
    createdIn: string
}
