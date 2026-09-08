import * as z from "zod";
import { signupSchema, loginSchema } from "./auth.schema";

export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];