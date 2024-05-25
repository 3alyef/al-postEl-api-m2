import { Socket } from "socket.io";
import { DecodedData } from "../../../interfaces/auth.interface";

class ProfileImageController{
    public setProfileImage(socket: Socket, route: string) {
        socket.on(route, async ({image, type, name}:{image: File, type: string, name: string})=>{
            const decoded: DecodedData = socket.auth;

            const blob = new Blob([image], { type }); 

            // 2. Criar um novo objeto File
            const reconstructedFile = new File([blob], name); // Use o nome de arquivo correto, se disponível

            console.log('Reconstructed File:', reconstructedFile);

            const urlImage = await this.changeImage(decoded.userSoul, reconstructedFile)
            console.log('urlImage', urlImage);

        })
    }

    private async changeImage(soulName: string, image: File){
        try {
            // Cria um objeto FormData
            const formData = new FormData();
            formData.append('imagem', image); 

            // Faz a requisição fetch
            const resp = await fetch(`${process.env.URL_M2}/addPhoto`, {
                method: 'POST',
                headers: {
                    'soulName': soulName,
                    'method': 'changeProfile'
                },
                body: formData,
            });

            // Verifica a resposta
            if (!resp.ok) {
                throw new Error(`Erro na requisição: ${resp.statusText}`);
            }

            // Processa a resposta
            const data = await resp.json();
            return data
        } catch(error){
            console.log(error)
        }
    }
}
const profileImageController = new ProfileImageController();
export {profileImageController}