import { Socket, Server } from "socket.io";
import { SearchUserByEmail } from "../../../services/Services";

interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}

interface Message {
    found: boolean,
    userSoul: string | null, 
    message: string 
}

class SearchUserController{
    searchUser( socket: Socket, io: Server, routeName: string, userSocketMap:Map<string, Socket[]>){
        socket.on(routeName, async ({ email }: { email: string })=>{
            // o usuario vai procurar um "friend" pelo email, / Enviando uma requisição para M1 para buscar pelo userSoul correspondente a esse email /   
            
            try {
                const decoded = socket.auth;
                
                console.log(decoded)
                if(decoded.email === email){
                    socket.emit(routeName, "O email procurado não pode ser igual ao email de origem." )
                    throw new Error("O email procurado não pode ser igual ao email de origem.");           
                }

                const content: Message = await new SearchUserByEmail().initialize( email );

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
                
            } catch(error){
                console.log(error)            
            }

            // Se tudo ocorrer bem, (usuário encontrado) o userSoul é enviado de volta para o user1, se ele quiser iniciar uma conversa com o usuario2 (o buscado) ele vai enviar de volta o soulName para a criação da sala. (se já existir a sala ele só reetorna para a sala já criada...)
        })
    }


}



const searchUserController = new SearchUserController()

export { searchUserController };