import { mongoose } from "../../DB";

const UserScheme = new mongoose.Schema({
    soulName: String,
    userImage: String,
    lastUpdateIn: String
});

const dataUserImageModel = mongoose.model('UserImageDetails', UserScheme);

export { dataUserImageModel };