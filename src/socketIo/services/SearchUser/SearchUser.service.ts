import { Socket } from "socket.io";
import { AddToNetworkList, SearchUserByEmail } from "../Services";
import { MessageUserResponse } from "../../interfaces/searchByEmail.interface";
import { DecodedData } from "../../interfaces/auth.interface";

class SearchUser {
    public async initialize(email: string, userSocketMap:Map<string, Socket[]>, routeName: string, decoded: DecodedData){
        
        const content: MessageUserResponse = await new SearchUserByEmail().initialize( email );
        console.log(email)
        if(content.found){  
            const sockets = userSocketMap.get(decoded.userSoul);
            if(sockets){
                sockets.forEach((socketElement) => {
                    // Envia a mensagem para todos os "nicknames" que detenham o mesmo soulName
                    console.log(content.dataUser)
                    socketElement.emit(routeName, content.dataUser);  
                    
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