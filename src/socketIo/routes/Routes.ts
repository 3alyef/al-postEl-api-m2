import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}


function router( socket: Socket, io: Server, decoded: decodedToken, userSocketMap:Map<string, Socket> ) { // ||HERE

    Controll.searchUserController.searchUser( socket, io,"searchByEmail", decoded, userSocketMap);
    Controll.joinRoomController.joinRoom( socket, io, "joinRoom", decoded,  userSocketMap);
    
}



export { router };
