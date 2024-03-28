import { Server } from "./Server";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

new Server().app.listen(PORT, ()=>{
    console.log(`Server running on port: http://localhost:${PORT}`)
})