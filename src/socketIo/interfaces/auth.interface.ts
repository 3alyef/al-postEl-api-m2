import { costumName } from "../../express/interfaces/request.interface";

export type DecodedData  = {
    first_name: string;
    last_name: string;
    userId: string;
    userSoul: string;
    email: string;
    costumName: costumName;
    iat?: number;
    exp?: number;
}

export type AllDataUser = {
    first_name: string | undefined;
    last_name: string | undefined;
    userSoul: string;
    email: string | undefined;
    costumName: costumName;
    imageData: {userImage: string | undefined, lastUpdateIn: string | undefined}
}

export interface CustomError extends Error {
    data?: any;
}
