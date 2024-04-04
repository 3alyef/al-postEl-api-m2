import { Socket } from 'socket.io';
import { DecodedData } from './types'; // Importe seus tipos aqui

type ExpectUsers = (this: SocketIo, socket: Socket, next: (err?: any) => void) => void;

type DecodedData  = {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}


declare module 'socket.io' {
    interface Socket {
        auth?: DecodedData;
    }
}

export interface CustomError extends Error {
    data?: any;
}

export interface sendMsg {
    content: string, 
    to: string,
    sender: string,
    chatName: string
}