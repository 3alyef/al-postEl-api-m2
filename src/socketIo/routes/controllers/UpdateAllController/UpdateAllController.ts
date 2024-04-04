import { Socket } from 'socket.io';
import { DecodedData } from '../../../../../custom';

class UpdateAllController {
    updateAll(socket: Socket, routeName: string, roomsExpectUsers: Map<string, string[]>){
        const decoded: DecodedData = socket.auth;
        const userSoul = decoded.userSoul;
        const rooms = roomsExpectUsers.get(userSoul);
        if(rooms){
            console.log("aqui", rooms)
            rooms.forEach((room)=>{
                socket.join(room);
                socket.emit(`Você foi adicionado na sala: ${room}`)
            })
        }
    }
}

const updateAllController = new UpdateAllController();

export { updateAllController };