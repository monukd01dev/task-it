/**
 * Application-wide immutable constants.
 * Combines TypeScript's 'as const' for compile-time strictness 
 * with standard Object.freeze for runtime security.
 */

import ENV from "../config/env";

const CONSTANTS = Object.freeze({
    PAYLOAD_LIMIT: '10kb',
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 mins
    GLOBAL_MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 25,

    ERRORS: Object.freeze({
        ROUTE_NOT_FOUND: 'The requested resource was not found.',
        INTERNAL_SERVER: 'An unexpected internal server error occurred.',
        RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later.',
        VALIDATION_FAILED: 'Validatin failed.'
    } as const),

    VALIDATION_ERRORS: Object.freeze({
        // Name Errors
        NAME_REQUIRED: "Name is required.",
        NAME_TOO_SHORT: "Name must be at least 2 characters.",
        NAME_TOO_LONG: "Name cannot exceed 60 characters.",
        NAME_INVALID_FORMAT: "Use only letters, spaces, or hyphens.",
        NAME_TYPE: "Name must be a string.",
        // Email Errors
        EMAIL_REQUIRED: "Email is required.",
        EMAIL_INVALID: "Please enter a valid email.",
        EMAIL_TOO_LONG: "Cannot Exceed 150 characters.",
        // Password Errors
        PASSWORD_REQUIRED: "Password is required.",
        PASSWORD_TOO_SHORT: "Must be at least 8 characters.",
        PASSWORD_TOO_LONG: "Cannot exceed 20 characters.",
        PASSWORD_NO_UPPER: "Add at least one uppercase letter.",
        PASSWORD_NO_LOWER: "Add at least one lowercase letter.",
        PASSWORD_NO_NUMBER: "Add at least one number.",
        PASSWORD_NO_SPECIAL: "Add a special character (e.g., @$!%*?&).",

        //OTP Errors
        OTP_REQUIRED: "OTP is required.",
        OTP_LENGTH: "OTP must be exactly 6 digits.",
        OTP_FORMAT: "OTP must contain only numbers.",

        //GOOGLE_AUTH
        GOOGLE_TOKEN_REQUIRED: "Google ID Token is required",
        GOOGLE_TOKEN_FORMAT: "Invalid Google ID Token format",
        GOOGLE_TOKEN_TOO_LONG: "Google ID Token is too long",

    } as const),

    REFRESH_TOKEN_COOKIE_OPTIONS: Object.freeze({
        httpOnly: true, //important: JS cannot read this cookie
        secure: !ENV.IS_DEVELOPMENT, // Production (HTTPS) -> true, Localhost (HTTP) -> false
        sameSite: 'strict', // to protect from CSRF attacks 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days in milliseconds
    } as const),

    CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS: Object.freeze({
        httpOnly: true, //important: JS cannot read this cookie
        secure: !ENV.IS_DEVELOPMENT, // Production (HTTPS) -> true, Localhost (HTTP) -> false
        sameSite: 'strict', // to protect from CSRF attacks
    } as const),

} as const);

export default CONSTANTS;
