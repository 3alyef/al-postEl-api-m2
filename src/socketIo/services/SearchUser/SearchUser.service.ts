import { Socket } from "socket.io";
import { DecodedData } from "../../interfaces/auth.interface";
import { AllDataUser, searchUserMethodsM1 } from "../SearchUserMethods/SearchUserMethodsM1.service";


class SearchUser {
    public async initialize(data: string, userSocketMap:Map<string, Socket[]>, routeName: string, decoded: DecodedData, _isCustomName?:boolean){
        let content: AllDataUser;
        if(_isCustomName){
            content = await searchUserMethodsM1.postSearchByCostumName( data )
        } else {
            content = await searchUserMethodsM1.postSearchUserByEmail( data )
        }
        
        console.log(data, content)
        if(content.found === true){  
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