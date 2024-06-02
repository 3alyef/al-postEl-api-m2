import { Request, Response, NextFunction } from "express";
import { userModel } from "../db/models/Models";
import { CustomError } from "../interfaces/common.interface";

export default async function verifyAccount(req: Request, res: Response, next: NextFunction){
    try {
        const soulName = req.headers.soulname;
        console.log('verify',soulName)
        if(soulName){
            const user = await userModel.findOne({ soulName });
            const method = req.headers.method as string;
    
            if (!user && method !== "changeProfile" && method !== "changeGroupProfile") {
                throw { status: 401, message: "User not found" };
            }
            //console.log("passou")
            next();
        } else {
            throw {status: 401, message: "need soulName"}
        }
    } catch(error) {
        const { status, message } = error as CustomError;
        console.error("Error:", message);
        res.status(status).json({ message }).end();
    }
} 