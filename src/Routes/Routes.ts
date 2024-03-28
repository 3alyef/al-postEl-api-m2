import { Request, Response, Router } from "express";

const router: Router = Router();

router.get('/', (req: Request, res: Response)=>{
    console.log('usuário novo...')
    res.send("Hello! Welcome to Al-PostEl!")
})


export { router };