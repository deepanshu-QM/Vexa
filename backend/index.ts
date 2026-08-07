import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {z} from "zod";
import {prisma} from "./db";

const app = express();
app.use(cors());
app.use(express.json());      //Middlewares are used for parsing the request body

const JWT_SECRET = process.env.JWT_SECRET;

