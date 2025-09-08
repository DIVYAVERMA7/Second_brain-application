import { model,Schema } from "mongoose";

const UserSchema = new Schema({
    username:{type:String,unique:true},
    password:String,
})



const ContentSchema = new Schema({
    link:String,
    type:String,
    title:String,
})

export const UserModel = model('User', UserSchema)