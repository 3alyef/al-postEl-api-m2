import { costumName } from "../../express/interfaces/request.interface";

export interface MessageUserResponse {
    found: boolean;
    dataUser: 
    {costumName: costumName, email: string | null, first_name: string | null, userSoul: string | null, userImageData: imageResp}[];
    message: string 
}

export interface Message {
    found: boolean;
    userSoul: string | null;
    message: string 
}

interface imageResp {
    userImage: string | null; 
    lastUpdateIn: string | null
}