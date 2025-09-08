import 'dotenv/config'
import type { Request,Response,NextFunction } from "express";
import Jwt, { decode } from "jsonwebtoken";

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const decoded = Jwt.verify(header as string,process.env.JWT_SECRET as string)

    if(decoded){
       // @ts-ignore
        req.userId = decoded.id
        next()
    }else{
        res.status(403).json({
            message:"You are not loggeg in"
        })
    }
}