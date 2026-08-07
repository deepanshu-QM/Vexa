

/*
In one sentence: response.id is where the user ID comes from, and req.userId is where you temporarily store it for the rest of that request.  */


import type {Request , Response , NextFunction } from "express";
import jwt ,{type JwtPayload} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req:Request , res:Response,next:NextFunction){

    const header = req.headers['authorization'] as string;
    if(!header){
        return res.status(401).json({
            message : "Unauthorzed"
        })
    }
    const token = header.split("")[1];
    if(!token) {
        return res.status(401).json({
            message :"Token is missing "
        })
    }
    const response = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = response.id
    next();

    catch(e){
        return res.status(401).json({
            message : "You are not logged In"
        })
    }

}
