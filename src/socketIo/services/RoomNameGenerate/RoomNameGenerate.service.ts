export function roomNameGenerate(user: string, friend: string, roomsExpectUsers: Map<string, string[]>): string {
    try {
        const randomRoomNumber1 = Math.floor(Math.random() * 101); 

        const randomRoomNumber2 = Math.floor(Math.random() * 101); 

        const roomName = `${randomRoomNumber1}${friend}El${user}${randomRoomNumber2}`;
        // Pegar todas as salas de friend e user. E conferir se existe uma sala igual entre user e friend se não existir criar uma sala e retornar ela, se já existir retornar a mesma sala

        // Verifique se já existe uma sala entre os dois usuários
        //console.log("user"+ user, "friend"+ friend)
        const friendRooms = roomsExpectUsers.get(friend);
        if (friendRooms) {
            // Verifique se há uma sala comum entre os usuários nas salas do friend
            const commonRoomFriend = friendRooms.find(room => room.includes(user) && room.includes(friend));
            if (commonRoomFriend) {
                // Se já existir uma sala entre os dois usuários nas salas do amigo, retorne essa sala
                return commonRoomFriend;
            } 
        } 
        
        return roomName;
    } catch(error) {
        throw new Error("Falha ao gerar roomName: "+ error);
    }
}