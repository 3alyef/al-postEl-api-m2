import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

function router( 
    socket: Socket, 
    io: Server, 
    userRoomMap: Map<string, string[]>, 
    decoded: decodedToken, 
    userSocketMap:Map<string, Socket[]> ) { 

    Controll.searchUserController.searchUser( 
        socket, 
        io, 
        "searchByEmail", 
        decoded, 
        userSocketMap
    );

    Controll.joinRoomController.joinRoom( 
        socket, 
        io, 
        userRoomMap, 
        "joinRoom", 
        decoded,  
        userSocketMap
    );

    Controll.updateLinksController.updateLinks( // Isso terá que ser implementado com o auxilio do client
        socket, 
        io, 
        "updateLinks", 
        userRoomMap
    )


}

export { router };
