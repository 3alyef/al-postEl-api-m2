import { mongoose } from "../../../../database/DB";

const UserScheme = new mongoose.Schema({
    soulName: String,
    custom_name: String,
    lastUpdateIn: String
});

const dataUserModel = mongoose.model('UserDetails', UserScheme);

export { dataUserModel };