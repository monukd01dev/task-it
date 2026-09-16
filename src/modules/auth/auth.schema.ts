import * as z from 'zod';
import CONSTANTS from '../../constants';
//primitives
    // Mononym safe, Unicode friendly, ReDoS immune name validator
    const namePrimitive = z.string({
        error: (issue) => issue.input === undefined
            ? CONSTANTS.VALIDATION_ERRORS.NAME_REQUIRED
            : CONSTANTS.VALIDATION_ERRORS.NAME_TYPE

    })
        .min(2, { error: CONSTANTS.VALIDATION_ERRORS.NAME_TOO_SHORT })
        .max(60, { error: CONSTANTS.VALIDATION_ERRORS.NAME_TOO_LONG })
        .transform(val => val.trim())
        .refine(
            // Added the dot (\.) to the allowed middle characters
            // Added the dot (\.) to the allowed ending characters
            val => /^[\p{L}](?:[\p{L}'\s.-]*[\p{L}.])?$/u.test(val),
            { error: CONSTANTS.VALIDATION_ERRORS.NAME_INVALID_FORMAT }
        );

    const emailPrimitive = z.email({ error: CONSTANTS.VALIDATION_ERRORS.EMAIL_INVALID })
        .max(150,{error : CONSTANTS.VALIDATION_ERRORS.EMAIL_TOO_LONG})
        .transform(val => val.trim().toLowerCase());

    const passwordPrimitive = z.string({ error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_REQUIRED })
        .min(8, { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_TOO_SHORT })
        .max(20, { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_TOO_LONG })
        .refine(val => /[A-Z]/.test(val), { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_NO_UPPER })
        .refine(val => /[a-z]/.test(val), { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_NO_LOWER })
        .refine(val => /\d/.test(val), { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_NO_NUMBER })
        .refine(val => /[@$!%*?&]/.test(val), { error: CONSTANTS.VALIDATION_ERRORS.PASSWORD_NO_SPECIAL });

    const otpPrimitive = z.string({
        error: (issue) => issue.input === undefined
            ? CONSTANTS.VALIDATION_ERRORS.OTP_REQUIRED
            : CONSTANTS.VALIDATION_ERRORS.OTP_FORMAT
    })
        .length(6, { error: CONSTANTS.VALIDATION_ERRORS.OTP_LENGTH })
        .regex(/^\d+$/, { error: CONSTANTS.VALIDATION_ERRORS.OTP_FORMAT });

    const idTokenPrimitive = z
    .string({
        error: (issue) => issue.input === undefined
            ? CONSTANTS.VALIDATION_ERRORS.GOOGLE_TOKEN_REQUIRED
            : CONSTANTS.VALIDATION_ERRORS.GOOGLE_TOKEN_FORMAT
    })
    .max(2500, { error: CONSTANTS.VALIDATION_ERRORS.GOOGLE_TOKEN_TOO_LONG });

//schemas
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

    export const googleAuthSchema = z.object({
        body: z.strictObject({
            idToken: idTokenPrimitive
        })
    });

    

