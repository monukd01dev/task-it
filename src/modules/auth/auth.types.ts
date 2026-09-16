import * as z from "zod";
import { signupSchema, loginSchema, verifyOtpSchema, googleAuthSchema } from "./auth.schema";
import { IOtpDocument } from "./otp.model";

export interface IOtpRepository {
    createOtp(email: string, otp: string): Promise<IOtpDocument>;
    findOtp(email: string, otp: string): Promise<IOtpDocument | null>;
    findOtpByEmail(email:string):Promise<IOtpDocument | null>;
    deleteOtp(email: string): Promise<void>;
}


export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type VerfiyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>['body'];

export interface IAuthService {
    // 1. Local Auth
    signup(signupData: SignupInput): Promise<void>; 
    verifyOtp(verifyData: VerfiyOtpInput): Promise<string>; // Returns JWT
    login(loginData: LoginInput): Promise<string>; // Returns JWT
    resendOtp(email:string):Promise<void>;
    // 2. Google Auth (Signup & Login handled together)
    googleAuth(googleAuthData: GoogleAuthInput): Promise<string>; // Returns JWT

}