import { Socket, Server } from "socket.io";
import { SearchUserByEmail } from "../../../services/Services";

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}


class JoinRoomController {
    joinRoom(socket: Socket, io: Server, routeName: string, decoded: decodedToken, userSocketMap:Map<string, Socket[]>){ // ||HERE
        socket.on(routeName, async ({friendName}: {friendName: string})=>{

            /* Procurar pelo socket correspondente ao token no userSocketMap and so send to respectful user */

            /* Precisa implementar a busca se o usuario já está em outra sala */
            let alreadyInRoom: boolean = false;

            const userMain: string = decoded.userSoul;
            const user2 = friendName;
            const roomName = `${userMain}-${user2}`;
            const alreadyHaveRoom = await this.consultarServidorM3(roomName); // Consulta o servidor M3 para verificar se já há uma sala aberta entre userMain e user2
            if (!alreadyInRoom) {
                
                
                


            } else {
                // Lógica para lidar se o usuário não estiver em uma sala
            }
        })

        
    }
    private async consultarServidorM3(roomName: string): Promise<boolean>{
        return false
    }
}

const joinRoomController = new JoinRoomController()

export { joinRoomController };

/*
                const roomExists = await this.consultarServidorM3(roomName);

                    
                if (roomExists) {
                    // Ingressa na sala existente
                    socket.join(roomName);
                    console.log(`Usuário ingressou na sala ${roomName}.`);
                } else {
                    // Cria uma nova sala e ingressa nela
                    socket.join(roomName);
                    console.log(`Sala ${roomName} criada e usuário ingressou automaticamente.`);
                }*/