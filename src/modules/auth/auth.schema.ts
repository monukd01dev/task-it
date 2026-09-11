import * as z from 'zod';
import { VALIDATION_ERRORS } from '../../utils/errorCode';
import CONSTANTS from '../../constants';
// Mononym safe, Unicode friendly, ReDoS immune name validator
const namePrimitive = z.string({
    error: (issue) => issue.input === undefined
        ? VALIDATION_ERRORS.NAME_REQUIRED
        : VALIDATION_ERRORS.NAME_TYPE

})
    .min(2, { error: VALIDATION_ERRORS.NAME_TOO_SHORT })
    .max(60, { error: VALIDATION_ERRORS.NAME_TOO_LONG })
    .transform(val => val.trim())
    .refine(
        // Added the dot (\.) to the allowed middle characters
        // Added the dot (\.) to the allowed ending characters
        val => /^[\p{L}](?:[\p{L}'\s.-]*[\p{L}.])?$/u.test(val),
        {error:VALIDATION_ERRORS.NAME_INVALID_FORMAT}
    );

const emailPrimitive = z.email({ error: VALIDATION_ERRORS.EMAIL_INVALID })
    .transform(val => val.trim().toLowerCase());

const passwordPrimitive = z.string({ error: VALIDATION_ERRORS.PASSWORD_REQUIRED })
    .min(8, { error: VALIDATION_ERRORS.PASSWORD_TOO_SHORT })
    .max(20, { error: VALIDATION_ERRORS.PASSWORD_TOO_LONG })
    .refine(val => /[A-Z]/.test(val), {error:VALIDATION_ERRORS.PASSWORD_NO_UPPER})
    .refine(val => /[a-z]/.test(val), {error:VALIDATION_ERRORS.PASSWORD_NO_LOWER})
    .refine(val => /\d/.test(val), {error:VALIDATION_ERRORS.PASSWORD_NO_NUMBER})
    .refine(val => /[@$!%*?&]/.test(val), {error:VALIDATION_ERRORS.PASSWORD_NO_SPECIAL});

const otpPrimitive = z.string({ 
    error : (issue) => issue.input === undefined 
    ? CONSTANTS.VALIDATION_ERRORS.OTP_REQUIRED
    : CONSTANTS.VALIDATION_ERRORS.OTP_FORMAT
 })
    .length(6, { message: CONSTANTS.VALIDATION_ERRORS.OTP_LENGTH })
    .regex(/^\d+$/, { message: CONSTANTS.VALIDATION_ERRORS.OTP_FORMAT });

export const signupSchema = z.object({
    body: z.strictObject({
        name: namePrimitive,
        email: emailPrimitive,
        password: passwordPrimitive,
    })//make sure only these listed property is sent as resp anyother property will fail the schema
})

export const loginSchema = z.object({
    body: z.strictObject({
        email: emailPrimitive,
        password: passwordPrimitive,
    })
})

export const verifyOtpSchema = z.object({
    body: z.strictObject({
        email: emailPrimitive,
        otp: otpPrimitive
    })
});


