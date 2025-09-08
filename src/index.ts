import 'dotenv/config'
import express from 'express'
import { ContentModel, UserModel } from './db.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { userMiddleware } from './middleware.js'

await mongoose.connect(process.env.MONGO_URL as string) 
const app = express()

app.use(express.json());
app.post('/signup',async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password,6)

    try{await UserModel.create({
        username:username,
        password:hashedPassword
    })

    res.json({
        message:"You are signed up successfully"
    })}catch(e){
        res.status(411).json({
            message:"User already exists"
        })
    }
    
})

app.post('/signin',async(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const existingUser = await UserModel.findOne({
        username:username
    })
    if(!existingUser){
        return res.status(403).json({
            message:"User does not exist"
        })
    }

    const passwordMatch = await bcrypt.compare(password,existingUser.password as string)

    
        if(passwordMatch){
            const token = jwt.sign({
                id:existingUser._id.toString()
            },process.env.JWT_SECRET as string)
            res.json({
                token:token
            })
        }else{
            res.status(403).json({
                message:'Incorrect credentials'
            })
        }
})

app.post('/content',userMiddleware,async(req,res)=>{
    const link = req.body.link
    const type = req.body.type
    const title = req.body.title
    ContentModel.create({
        link, type, title,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })

    return res.json({
        message:"Content added"
    })
    
})

app.get('/content',userMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })
})

app.delete('/content',(req,res)=>{
    
})

app.post('/brain/share',(req,res)=>{
    
})

app.get('/brain/:sharelink',(req,res)=>{
    
})

app.listen(process.env.PORT)