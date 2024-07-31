import express from "express";
import { UpdateMsgStatus } from "../services/Services";
const app = express();

app.use(express.json()); 

app.post("/statusMsgUpdate", UpdateMsgStatus); // Messages Status

export default app;