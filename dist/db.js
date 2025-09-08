import mongoose, { model, Schema } from "mongoose";
const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
});
const ContentSchema = new Schema({
    link: String,
    type: String,
    title: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }]
});
export const UserModel = model('User', UserSchema);
export const ContentModel = model('Content', ContentSchema);
//# sourceMappingURL=db.js.map