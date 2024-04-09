import { Socket } from 'socket.io';
import { DecodedData } from './types'; // Importe seus tipos aqui

declare module 'socket.io' {
    interface Socket {
        auth?: DecodedData;
    }
}


export interface MessageUser {
    found: boolean,
    userSoul: string | null, 
    message: string 
}


type Message = {
    from: string;
    content: string;
    to: string;
    data: string;
};

type ExpectUsers = (this: SocketIo, socket: Socket, next: (err?: any) => void) => void;



type TokenPayload = {
    update: boolean;
    roomName: string;
    users: string[];
    token: string;
};

type Content = TokenPayload | Array<string | boolean | string[]>;
