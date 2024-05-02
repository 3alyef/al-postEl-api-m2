import { costumName } from "../../express/interfaces/request.interface";

export type DecodedData  = {
    userId: string;
    userSoul: string;
    email: string;
    costumNameC: costumName;
    iat: number;
    exp: number;

}

export interface CustomError extends Error {
    data?: any;
}
