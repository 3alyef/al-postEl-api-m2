export interface msgsResponse {
    _id: string;
    fromUser: string;
    viewStatus: "onServer" | "delivered" | "seen";
    deletedTo: "none" | "justTo" | "justAll" | "justFrom" | "all";
    toUser: string;
    message: string;
    createdIn: string;
}

export interface GroupsProps {
    _id: string;
    groupName: string ;
    groupParticipants: string ;
    groupAdministratorParticipants: string
}