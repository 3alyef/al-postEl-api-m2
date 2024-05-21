import { Server as Io, Socket } from "socket.io";
import { router as socketIoRoutes } from "./routes/Routes";
import { Server as ServerHTTP } from 'http';
import * as middlewares from "./middlewares/middlewares";
import { ExpectUsers } from "../../custom";
import { msgsResponse } from "./interfaces/msgs.interface";
import { AllDataUser, DecodedData } from "./interfaces/auth.interface";
import { msgsGroupDB, newGroupResponse } from "./interfaces/group.interface";

abstract class SocketIo{
    private socketIo: Io;
    public userSocketMap: Map<string, Socket[]>; // Rooms list on

    public previousMessages: Map<string, msgsResponse[]>; // Msg List
    public previousGroupMessages: Map<string, msgsGroupDB[]>
    public roomsExpectUsers: Map<string, string[]>;
    public roomsProps: Map<string, AllDataUser[]>;
    public groupsExpectUsers: Map<string, newGroupResponse[]>;
    public groupsAdmin: Map<string, string[]>
    constructor( server: ServerHTTP ){     
        this.previousGroupMessages = new Map<string, msgsGroupDB[]>();
        this.roomsExpectUsers = new Map<string, string[]>();
        this.roomsProps = new Map<string, AllDataUser[]>();
        this.userSocketMap = new Map<string, Socket[]>();
        this.groupsAdmin = new Map<string, string[]>();
        this.previousMessages = new Map<string, msgsResponse[]>();
        this.groupsExpectUsers = new Map<string, newGroupResponse[]>()
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

        const expectUsers = middlewares.expectUsers.bind(this) as ExpectUsers
        this.socketIo.use((socket, next)=>expectUsers(socket, next));

        this.socketIo.on("connection", (socket: Socket)=> {    
            const decoded: DecodedData = socket.auth;
            
            // console.log("new user")
            let socketsList: Socket[] | undefined = this.userSocketMap.get(decoded.userSoul);

            if(!socketsList){
                socketsList = [];
                this.userSocketMap.set(decoded.userSoul, socketsList);
            }
            socketsList.push(socket); 

            socket.emit("updateSoul", {soulName: decoded.userSoul})
            socket.on('disconnect', () => {
                this.sendStatusOnline(decoded.userSoul)
                this.handleDisconnect(decoded, socketsList, socket)

            });

        
            socketIoRoutes( this.socketIo, socket, this.userSocketMap, this.roomsExpectUsers, this.previousMessages, this.groupsExpectUsers, this.groupsAdmin, this.previousGroupMessages, this.roomsProps ); 
    
            this.socketIo.of("/").adapter.on("create-room", (room: string) => {
                console.log(`room ${room} was created`);
            });
            
        }) 
        
    }

    private sendStatusOnline(userSoul: string){
        let rooms = this.roomsExpectUsers.get(userSoul);
        if(rooms){
            rooms.forEach((room)=>{
                const roomDatas = this.roomsProps.get(room)
                const friendData = roomDatas?.filter(el => el.userSoul != userSoul)[0];
                
                
                // Atualiza o status do user Online to the friends
                if(friendData){
                    const _isFriendOnline = this.userSocketMap.get(friendData.userSoul);
                    if(_isFriendOnline && _isFriendOnline.length > 0){
                        _isFriendOnline.forEach((socketFriend)=>{
                            socketFriend.emit("updateFriendsOnline", {userSoul: userSoul, online: false})
                        })
                    }
                }
                
            })
        }
    }

    private handleDisconnect(decoded:DecodedData, socketsList: Socket[], socket: Socket){
        const userSoul: string = decoded.userSoul
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

        const roomsUser = this.roomsExpectUsers.get(userSoul)
        this.roomsExpectUsers.delete(userSoul)
        if(roomsUser){
            if(this.roomsExpectUsers.size > 0){
                this.roomsExpectUsers.forEach((value, key, map)=>{
                    roomsUser.forEach((roomUser)=>{
                        const equalRooms = value.filter(room => room === roomUser)
                        if(equalRooms.length > 0){
                            console.log('ainda existe ainda um membro online')
                        } else {
                            //console.log('previousMessagesBEFORE', this.previousMessages)
                            this.previousMessages.delete(roomUser)
                            this.roomsProps.delete(roomUser)
                            //console.log('previousMessagesAFTER', this.previousMessages)
                        }
                    })
                    
                })
            } else {
                roomsUser.forEach((roomUser)=>{
                    //console.log('previousMessagesBEFORE', this.previousMessages)
                    this.previousMessages.delete(roomUser)
                    this.roomsProps.delete(roomUser)
                    //console.log('previousMessagesAFTER', this.previousMessages)
                })
            }
            
        }
        

    }

}


export default SocketIo;
