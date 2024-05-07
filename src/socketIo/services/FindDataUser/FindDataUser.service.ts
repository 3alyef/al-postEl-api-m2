import { dataUserImageModel, dataUserModel, userModel } from "../../../express/db/models/Models";
import { costumName } from "../../../express/interfaces/request.interface";
import { AllDataUser } from "../../interfaces/auth.interface";

export async function findDataUser(userSoul: string): Promise<AllDataUser> {
    try {

        const mainDataUser = await findMainDataUser(userSoul);
        const mainDataCostumName = await findCostumName(userSoul);
        const mainDataImage = await findMainDataImage(userSoul);

        return {costumName: mainDataCostumName, email: mainDataUser.email, first_name: mainDataUser.first_name, last_name: mainDataUser.last_name, imageData: mainDataImage, userSoul}
    } catch (error) {
        console.log(error)
        return { first_name: undefined, last_name: undefined ,costumName: {costum_name: undefined, lastUpdateIn: undefined}, email: undefined, imageData: {lastUpdateIn: undefined, userImage: undefined}, userSoul}
    }
}

async function findCostumName(soulName: string): Promise<costumName> {
    try {
        const dataCostum: {costum_name: string, lastUpdateIn: string} | null = await dataUserModel.findOne({soulName}, "costum_name lastUpdateIn")
        if(!dataCostum){
            throw new Error("Erro ao buscar costum name")
        }
        const costum_name = dataCostum.costum_name;
        const lastUpdateIn = dataCostum.lastUpdateIn;
        return { costum_name, lastUpdateIn }
    } catch (erro) {
        console.log(erro)
        return {costum_name: undefined, lastUpdateIn: undefined}
    }
}

async function findMainDataUser(soulName: string): Promise<{email: string | undefined, first_name: string | undefined, last_name: string | undefined}> {
    try {
        const mainDataUser: {email: string, first_name: string, last_name: string} | null = await userModel.findOne({soulName}, "email first_name last_name")
        if(!mainDataUser) {
            throw Error("error ao buscar main data user")
        }

        return {email: mainDataUser.email, first_name: mainDataUser.first_name, last_name: mainDataUser.last_name}
    } catch (error) {
        console.log(error)
        return { email: undefined, first_name: undefined, last_name: undefined}
    }
}

async function findMainDataImage(soulName: string): Promise<{userImage: string | undefined, lastUpdateIn: string | undefined}> {
    try {
        const mainDataImage: {userImage: string, lastUpdateIn: string} | null = await dataUserImageModel.findOne({soulName}, "userImage lastUpdateIn")
        if(!mainDataImage) {
            throw Error("error ao buscar main data user")
        }
        console.log(mainDataImage)
        return {userImage: mainDataImage.userImage, lastUpdateIn: mainDataImage.lastUpdateIn}
    } catch (error) {
        console.log(error)
        return { userImage: undefined, lastUpdateIn: undefined }
    }
}