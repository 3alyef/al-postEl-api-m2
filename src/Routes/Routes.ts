import { Request, Response, Router } from "express";
import * as Controll from "./Controllers/Controllers";

const router: Router = Router();

router.get("/", (req: Request, res: Response)=>{
    console.log('Usuário novo...')
    res.send("Hello! Welcome to Al-PostEl M2!")
})

router.post("/connect", Controll.loginCollection.postLogin)


export { router };