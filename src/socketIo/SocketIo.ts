import { Server as Io, Socket } from "socket.io";
import { router as socketIoRoutes } from "./routes/Routes";
import { Server as ServerHTTP } from 'http';
import * as middlewares from "./middlewares/middlewares";
import { DecodedData } from "../../custom";

abstract class SocketIo{
    private socketIo: Io;
    private userSocketMap: Map<string, Socket[]>; // Rooms list on
    private userRoomMap: Map<string, string[]>; // Users list on

    constructor( server: ServerHTTP ){     
        this.userRoomMap = new Map<string, string[]>();
        this.userSocketMap = new Map<string, Socket[]>(); 
        this.socketIo = new Io( server, {
            cors: {
                origin: "*", 
                methods: ["GET", "POST"], 
                credentials: true 
            }
        });
        this.setupSocketIo();
    }

    private setupSocketIo(){     
        this.socketIo.use(middlewares.verifyJWT);
        this.socketIo.on("connection", (socket: Socket)=> {       
            const decoded: DecodedData = socket.auth;
            
            let socketsList: Socket[] | undefined = this.userSocketMap.get(decoded.userSoul);

            if(!socketsList){
                socketsList = [];
                this.userSocketMap.set(decoded.userSoul, socketsList);
            }
            socketsList.push(socket); 

            socket.on('disconnect', () => {
                // Remove a entrada do mapeamento quando o usuário se desconect
                const index = socketsList.indexOf(socket); // Procura o index do socket que está saindo
                if (index !== -1) { // !== -1 quer dizer que existe
                    socketsList.splice(index, 1);
                    console.log('Socket removido do array de sockets.');
                }

                // Se não houver mais sockets associados ao soulName, remova o soulName do mapeamento
                if (socketsList.length === 0) {
                    this.userSocketMap.delete(decoded.userSoul);
                    console.log(`SoulName: ${decoded.userSoul} removido do mapeamento.`);
                }
            });

            //console.log(decoded);
        
            socketIoRoutes( socket, this.socketIo, this.userRoomMap, this.userSocketMap ); 
    
            this.socketIo.of("/").adapter.on("create-room", (room: string) => {
                console.log(`room ${room} was created`);
            });
            
        }) 
        
    }

}


export default SocketIo;

/* O userRoomMap será responsável por guardar as informações da sala, será mais ou menos assim:
    ==> [roomName1=>[[userSoul1],[userSoul2]], roomName2=>[[userSoul1],[userSoul2]]]; Assim só ingressa na sala quem tem o mesmo userSoul já pre preenchido
*/

/*
        const msgs = this.socketIo.of("/msgs")

        msgs.on("connection", ()=>{

        })*/