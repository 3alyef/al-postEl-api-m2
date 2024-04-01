import { Socket, Server } from "socket.io";
import { SearchUserByEmail } from "../../../services/Services"
interface searchByEmail {
    email: string;
}

class SearchUserController{
    searchUser(socket: Socket, routeName: string){
        socket.on("searchByEmail", async ({ email }: searchByEmail)=>{
            // o usuario vai procurar um usuario pelo email, / Enviando uma requisição para M1 para buscar pelo userSoul correspondente a esse email / 

            try {
                const userSoul = await new SearchUserByEmail().initialize( email );
                console.log(userSoul)
            } catch(error){
                socket.emit("Ocorreu um erro ao buscar o usuário", {error})
            }

            // Se tudo ocorrer bem, (usuário encontrado) o userSoul é enviado de volta para o user1, se ele quiser iniciar uma conversa com o usuario2 (o buscado) ele vai enviar de volta o soulName para a criação da sala. (se já existir a sala ele só reetorna para a sala já criada...)
        })
    }
}



const searchUserController = new SearchUserController()

export { searchUserController };