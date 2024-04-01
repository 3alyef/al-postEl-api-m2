import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}


function router( socket: Socket, io: Server, decoded: decodedToken, token:string, userSocketMap:Map<string, Socket> ) {

    Controll.searchUserController.searchUser( socket, io,"searchByEmail", decoded, token,  userSocketMap);
    Controll.joinRoomController.joinRoom( socket, io, "joinRoom", decoded, token,  userSocketMap);
    
}



export { router };
