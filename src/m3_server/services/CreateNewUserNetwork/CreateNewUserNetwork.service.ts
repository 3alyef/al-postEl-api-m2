import { Request, Response } from "express";
import { userNetworkModel } from "../../db/models/Models";
import { networkRequest } from "../../interfaces/userNetworkSetNew.interface";

class CreateNewUserNetwork {
    public async initialize(req: Request<{ body: networkRequest }>, res: Response): Promise<void> {
        try {
            const { user, friend, createdIn }: networkRequest = req.body;
            const networkExists = await this.checkIfNetworkExists(user, friend);
            console.log("aqui")
            if (!networkExists) {
                const newNetwork = await this.registerNewNetwork(user, friend, createdIn);
                res.status(201).json(newNetwork).end();
            } else {
                res.status(208).json(null).end();
            }
        } catch (error) {
            console.error("Error: " + error);
            res.status(501).json(null).end();
        }
    }

    private async checkIfNetworkExists(user: string, friend: string): Promise<boolean> {
        try {
            const network = await userNetworkModel.findOne({ user, friend });
            return !!network; // Retorna true se a rede existir, false caso contrário
        } catch (error) {
            throw new Error("Ocorreu um erro ao consultar o banco de dados.");
        }
    }

    private async registerNewNetwork(user: string, friend: string, createdIn: string): Promise<any> {
        try {
            const newNetwork = new userNetworkModel({ user, friend, createdIn });
            return await newNetwork.save();
        } catch (error) {
            throw new Error("Ocorreu um erro ao registrar uma nova rede no banco de dados.");
        }
    }
}

export default CreateNewUserNetwork;
