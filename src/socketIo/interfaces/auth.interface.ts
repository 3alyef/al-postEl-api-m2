export type DecodedData  = {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

export interface CustomError extends Error {
    data?: any;
}
