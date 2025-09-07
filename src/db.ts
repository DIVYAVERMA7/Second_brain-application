import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username:String,
    password:String,
})

const ContentSchema = new Schema({
    link:String,
    type:String,
    title:String,
    

})