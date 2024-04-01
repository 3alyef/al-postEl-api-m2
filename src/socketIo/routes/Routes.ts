import { Socket, Server } from "socket.io";
import * as Controll from "./controllers/Controllers";




function router( socket: Socket, io: Server ) {

    Controll.searchUserController.searchUser( socket ,"searchByEmail" )
    
    
    
}



export { router };
