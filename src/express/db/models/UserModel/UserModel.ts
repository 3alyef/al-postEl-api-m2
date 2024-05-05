import { mongoose } from "../../DB";

const UserScheme = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    soulName: String
});

const userModel = mongoose.model('User', UserScheme);

export { userModel };

