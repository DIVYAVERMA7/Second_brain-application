import 'dotenv/config'
import express from 'express'
import { UserModel } from './db.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGO_URL as string) 
const app = express()

app.use(express.json());
app.post('/signup',async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password,6)

    await UserModel.create({
        username:username,
        password:hashedPassword
    })

    res.json({
        message:"You are signed up successfully"
    })
})

app.post('/signin',(req,res)=>{
    const username = req.body.username
    
})

app.post('/content',(req,res)=>{
    
})

app.get('/content',(req,res)=>{
    
})

app.delete('/content',(req,res)=>{
    
})

app.post('/brain/share',(req,res)=>{
    
})

app.get('/brain/:sharelink',(req,res)=>{
    
})

app.listen(process.env.PORT)