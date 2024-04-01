import { Server } from "./Server";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

new Server().server.listen(PORT, ()=>{ // LEMBRE-SE NÃO É APP É SERVER!
    console.log(`Server running on port: http://localhost:${PORT}`)
})