import { Schema,model,Document } from "mongoose";

export interface IOtpDocument extends Document{
    email : string,
    otp : string,
    createdAt : Date,
}

const otpSchema = new Schema<IOtpDocument>({
    email : {
        type : String,
        required : true,
        lowercase : true,
        index:true,
    },
    otp : {
        type : String,
        required : true,
    },
    createdAt :{
        type : Date,
        default : Date.now,
        expires : 300,
    }
})

export const OtpModel = model<IOtpDocument>('Otp',otpSchema);