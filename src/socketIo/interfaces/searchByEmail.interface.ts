export interface MessageUserResponse {
    found: boolean;
    dataUser: {first_name: string | null, userSoul: string | null;userImageData: imageResp};
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