import { Socket } from "socket.io";
import { findDataUser } from "../../../services/Services";

class UserDetailsController {
    public async getDataUser(socket: Socket, routeName: string){
        socket.on(routeName, async (userSoul: string)=>{
            const allAboutUser = await findDataUser(userSoul);
            console.log('getDataUser§§§§§', allAboutUser)
            if(allAboutUser){
                socket.emit("getDataUserRes", {dataUser: allAboutUser})
            } else {
                socket.emit("getDataUserRes", {message: "error"})
            }
            
        })
    }
}
const userDetailsController = new UserDetailsController();

export { userDetailsController }