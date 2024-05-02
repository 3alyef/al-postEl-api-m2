import { Socket, Server } from "socket.io";
import { SearchUser } from "../../../services/Services";



class SearchUserController{
    searchUser( socket: Socket, routeName: string, userSocketMap:Map<string, Socket[]>){
        socket.on(routeName, async ({ email }: { email: string })=>{
            // o usuario vai procurar um "friend" pelo email, / Enviando uma requisição para M1 para buscar pelo userSoul correspondente a esse email /   
            
            try {
                const decoded = socket.auth;           
                console.log(email)
                if(decoded){
                    if(decoded.email === email){
                        socket.emit(`${routeName}Error`, "O email procurado não pode ser igual ao email de origem." )
                        throw new Error("O email procurado não pode ser igual ao email de origem.");           
                    }
                    await new SearchUser().initialize(email,  userSocketMap, routeName, decoded);
                }
                
                
            } catch(error){
                console.error(error)            
            }

            // Se tudo ocorrer bem, (usuário encontrado) o userSoul é enviado de volta para o user1, se ele quiser iniciar uma conversa com o usuario2 (o buscado) ele vai enviar de volta o soulName para a criação da sala. (se já existir a sala ele só reetorna para a sala já criada...)
        })
    }


}



const searchUserController = new SearchUserController()

export { searchUserController };