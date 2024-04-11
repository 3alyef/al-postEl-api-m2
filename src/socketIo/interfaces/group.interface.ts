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