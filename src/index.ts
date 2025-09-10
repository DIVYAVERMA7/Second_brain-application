import 'dotenv/config'
import express from 'express'
import { ContentModel, LinkModel, UserModel } from './db.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { userMiddleware } from './middleware.js'
import { random } from './utils.js'

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

app.delete('/content',userMiddleware,async(req,res)=>{
    const contentId = req.body.contentId
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
    res.json({
        message:"delete"
    })
})

app.post('/brain/share',userMiddleware,async(req,res)=>{
    const share = req.body.share
    if(share){
        //@ts-ignore
        const existingLink = await LinkModel.findOne({userId:req.userId})
        if(existingLink){
            res.json({
                hash:existingLink.hash
            })
            return
        }
        const hash = random(10)
     await LinkModel.create({
        //@ts-ignore
            userId:req.userId,
            hash:hash
        })
        res.json({
            message:"/share/"+hash
        })
    }else{
     await LinkModel.deleteOne({
         //@ts-ignore
            userId:req.userId
        })
        res.json({
            message:"Removed link"
        })
    }
    res.json({
        message:"Updated sharable Link"
    })
})

app.get('/brain/:sharelink',async(req,res)=>{
    const hash = req.params.sharelink
    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return
    }
    const content = await ContentModel.find({
        userId:link.userId
    })
    const user = await UserModel.findOne({
        _id:link.userId.toString()
    })
    if(!user){
        res.status(411).json({
            message:"User not found, error should ideallhy not happen"
        })
        return
    }
    res.json({
        username:user.username,
        content:content
    })
    
})

app.listen(process.env.PORT)