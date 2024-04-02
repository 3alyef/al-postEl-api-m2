import { Socket, Server } from "socket.io";
import { SearchUserByEmail } from "../../../services/Services";
interface decodedToken {
    userId: string;
    userSoul: string;
    email: string;
    iat: number;
    exp: number;

}


class SearchUserController{
    searchUser( socket: Socket, io: Server, routeName: string, decoded: decodedToken, userSocketMap:Map<string, Socket>){ // ||HERE
        socket.on(routeName, async ({ email }: { email: string })=>{
            // o usuario vai procurar um usuario pelo email, / Enviando uma requisição para M1 para buscar pelo userSoul correspondente a esse email /   

            try {

                if(decoded.email === email)throw new Error("O email procurado não pode ser igual ao email de origem.");

                const content: { found: boolean, userSoul: string | null, message: string } = await new SearchUserByEmail().initialize( email );

                const friendName = content.userSoul;
                

                if(content.found){     
                    // Envia a mensagem para o usuário específico contendo o friendName requisitado

                    // ||HERE------------------

                    if(userSocketMap.get(decoded.userSoul)){
                        console.log("here",userSocketMap.get(decoded.userSoul))
                        io.emit(routeName ,`${friendName}`); 
                    }                 
                    
                } else {
                    // Envia a mensagem para o usuário específico

                    // ||HERE ------------------
                    socket.emit(routeName, `Usuário não encontrado`);                 
                    
                    throw new Error("Usuário não encontrado");
                }
                
            } catch(error){
                console.log(error)
                socket.emit("Ocorreu um erro ao buscar o usuário", {error})
            }

            // Se tudo ocorrer bem, (usuário encontrado) o userSoul é enviado de volta para o user1, se ele quiser iniciar uma conversa com o usuario2 (o buscado) ele vai enviar de volta o soulName para a criação da sala. (se já existir a sala ele só reetorna para a sala já criada...)
        })
    }


}



const searchUserController = new SearchUserController()

export { searchUserController };