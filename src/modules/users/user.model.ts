import { Schema,model } from "mongoose";
import { IUserDocument } from "./user.types";

const userSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVarified: {
        type: Boolean,
        default: false,
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

export const  UserModel = model<IUserDocument>('User',userSchema)

