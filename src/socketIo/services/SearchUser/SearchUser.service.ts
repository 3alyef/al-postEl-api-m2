import { Socket } from "socket.io";
import { SearchUserByEmail } from "../Services";
import { MessageUserResponse } from "../../interfaces/searchByEmail.interface";

class SearchUser {
    public async initialize(email: string, userSocketMap:Map<string, Socket[]>, routeName: string, decoded: any){
        const content: MessageUserResponse = await new SearchUserByEmail().initialize( email );


        const friendName = content.userSoul;
                
        if(content.found){  
            const sockets = userSocketMap.get(decoded.userSoul);
            if(sockets){
                sockets.forEach((socketElement) => {
                    // Envia a mensagem para todos os /'nicknames" que detenham o mesmo soulName
                    socketElement.emit(routeName ,`${friendName}`);
                    
                });
            }            
            
        } else {

            // sockets is the same than => [[{}],[{}],[{}]]
            const sockets = userSocketMap.get(decoded.userSoul);
            if(sockets){
                sockets.forEach((socketElement) => {
                    // Envia a mensagem para todos os "nicknames" que detenham o mesmo soulName
                    socketElement.emit(routeName, `Usuário não encontrado`);  
                    
                });
            }   
                                       
            throw new Error("Usuário não encontrado");
        }
    }
}

export default SearchUser;