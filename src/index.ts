import { Server } from "./Server";
import dotenv from "dotenv";
dotenv.config();
const app = new Server();
const PORT = process.env.PORT || 3000;

app.server.listen(PORT, ()=>{
    console.log(`Server running on port: http://localhost:${PORT}`)
})