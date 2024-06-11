import { Request, Response } from "express";
import { networksDB } from "../../interfaces/userNetworkSetNew.interface";
import { userNetworkModel } from "../../db/models/Models";

class GetPrevUserNetwork {
    public async initialize(req: Request<{ body: userNetworkGetRequest }>, res: Response) {
        try {
            const { user }: userNetworkGetRequest = req.body;
            
            if (!user) {
                return res.status(401).end();
            }

            const resp = await this.findNetwork(user);
            
            if (resp === null) {
                
                return res.status(500).json({ error: "Error retrieving previous user networks." }).end();
            }

            console.log(resp);
            if(resp.length === 0){
                return res.status(200).send(JSON.stringify(null)).end();
            } else {
                return res.status(200).send(JSON.stringify(resp)).end();
            }
            
        } catch (error) {
            console.error("Error retrieving previous user networks:", error);
            return res.status(500).json({ error: "Internal server error occurred." });
        }
    }

    private async findNetwork(userSoul: string): Promise<networksDB[] | null> {
        try {
            const messages: networksDB[] = await userNetworkModel.find({ user: userSoul }, "_id user friend createdIn");

            let msg: networksDB[] = [];
            messages.forEach((el) => {
                const msgObj: networksDB = {
                    _id: el._id, user: el.user, friend: el.friend, createdIn: el.createdIn
                }
                msg.push(msgObj)
            });

            return msg;
        } catch (error) {
            console.error("Error using model to retrieve previous user networks:", error);
            return null;
        }
    }
}

export default GetPrevUserNetwork;
