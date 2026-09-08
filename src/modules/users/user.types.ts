import { Document } from "mongoose";

export interface IUserDocument extends Document {
    name: string,
    email: string,
    password?: string,
    googleId?: string,
    role: "user" | "admin",
    isVarified: boolean,
    tokenVersion: number,
    createdAt: Date,
    updatedAt: Date,
}