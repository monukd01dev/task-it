import express from 'express';
const authRouter = express.Router();
import validateResource from '../../middlewares/validateResource';
import { googleAuthSchema, loginSchema, resendOtpSchema, signupSchema, verifyOtpSchema } from './auth.schema';
import { di } from '../../di';
authRouter.post('/signup', validateResource(signupSchema), di.authController.signup);
authRouter.post('/verify-otp', validateResource(verifyOtpSchema), di.authController.verifyOtp);
authRouter.post('/resend-otp', validateResource(resendOtpSchema), di.authController.resendOtp);
authRouter.post('/login', validateResource(loginSchema), di.authController.login);
authRouter.post('/logout', di.authController.logout);
authRouter.post('/google-auth', validateResource(googleAuthSchema), di.authController.googleAuth);


export default authRouter;