import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {z} from "zod";
import {prisma} from "./db";
import {SignSchema,SignupSchema} from "./validation";

const app = express();
app.use(cors());
app.use(express.json());   


const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT SECRET is no defined in Environment variables ");
}

const SALT_ROUNDS = 10;

app.post("/signup", async(req,res) => {
    const parsed = SignupSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            message : "Incorrect Inputs"
        })
    }
    const data = parsed.data;
    try {
        const HashPassword = await bcrypt.hash(data.password,SALT_ROUNDS);
        const user = prisma.User.create({
            data : {
                username : data.username,
                password : HashPassword
            }
        });

        return res.json({
            id:user.id
        })
    }catch(e){
        return res.status(409).json({
            message : "Username is Already Exists"
        })
    }
})


app.post("/sigin", async(req,res) => {
    const parsed = SignSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            message : "Incorrect Inputs"
        })
    }
    const data = parsed.data;
    try {
        const user = prisma.User.findUnique({
            where : {
                username: data.username
            }
        });
        if(!user){
            return res.status(401).json({
                message : "Incorrect Credentials"
            })
        }
        const PasswordMatch = await bcrypt.compare(data.password , user.password);
        if(!PasswordMatch){
            return res.status(401).json({
                message : "Incorrect Credentials"
            })
        }
        const token = jwt.sign(
            {id : user.id},JWT_SECRET
        )

        return res.json({
            id : user.id,
            token
        })

    }catch(e){
        return res.status(500).json({
            message : "something wents Wrong"
        })
    }
})