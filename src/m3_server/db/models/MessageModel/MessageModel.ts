import { mongoose } from "../../../../database/DB";

const NewMessageScheme = new mongoose.Schema({
    fromUser: String,
    deletedTo: String,
    viewStatus: String,
    toUser: String,
    message: String,
    createdIn: String
});

const messageModel = mongoose.model('Message', NewMessageScheme);

export { messageModel };

