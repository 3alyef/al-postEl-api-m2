import { mongoose } from "../../../../database/DB";

const { Schema, model } = mongoose;
const NewMessageGroupSchema = new Schema({
    fromUser: { type: String, required: true },
    deletedTo: String,
    toUsers: { type: [String], required: true },
    viewStatus: String,
    toGroup: { type: String, required: true },
    message: { type: String, required: true },
    createdIn: { type: String, required: true }
});

NewMessageGroupSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.deletedTo instanceof Map) {
        obj.deletedTo = Object.fromEntries(obj.deletedTo);
    }
    if (obj.viewStatus instanceof Map) {
        obj.viewStatus = Object.fromEntries(obj.viewStatus);
    }
    return obj;
};

const messageGroupModel = model('MessageGroup', NewMessageGroupSchema);

export { messageGroupModel };
