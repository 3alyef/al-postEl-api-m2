export interface networksDB {
    _id: string;
    user: string;
    friend: string;
    createdIn: string;
}

export interface networkRequest {
    _id?: string;
    user: string;
    friend: string;
    createdIn: string;
}
