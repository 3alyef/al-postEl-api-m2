import { Request, Response } from "express";
import { changeProfilePhoto } from "../../../services/Services";

interface FilesRequest extends Request {
    file?: {location: string};
}
export class ChangePhoto {
    public postChangePhoto(req: FilesRequest, res: Response) {
        console.log("CHANGE_PHOTO");
        console.log(req.file?.location);

        const method = req.headers.method as string;
        const soulName: string = req.headers.soulname as string;
        const urlPhoto = req.file?.location;
        if(method === "changeProfile" && urlPhoto && soulName){
            changeProfilePhoto(res, soulName, urlPhoto)
        } else {
            res.send({});
        }
        
    }
}

const changePhoto = new ChangePhoto();
export { changePhoto };
