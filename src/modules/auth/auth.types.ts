import * as z from "zod";
import { signupSchema, loginSchema, verifyOtpSchema } from "./auth.schema";
import { IOtpDocument } from "./otp.model";

export interface IOtpRepository {
    createOtp(email: string, otp: string): Promise<IOtpDocument>,
    findOtp(email: string, otp: string): Promise<IOtpDocument | null>,
    deleteOtp(email: string): Promise<void>
}

export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type VerfiyOtpInput = z.infer<typeof verifyOtpSchema>['body'];