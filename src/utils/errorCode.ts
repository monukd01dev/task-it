export const VALIDATION_ERRORS = Object.freeze({
    // Name Errors
    NAME_REQUIRED: "Name is required.",
    NAME_TOO_SHORT: "Name must be at least 2 characters.",
    NAME_TOO_LONG: "Name cannot exceed 60 characters.",
    NAME_INVALID_FORMAT: "Use only letters, spaces, or hyphens.",
    NAME_TYPE : "Name must be a string.",
    // Email Errors
    EMAIL_REQUIRED: "Email is required.",
    EMAIL_INVALID: "Please enter a valid email.",

    // Password Errors
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_TOO_SHORT: "Must be at least 8 characters.",
    PASSWORD_TOO_LONG: "Cannot exceed 20 characters.",
    PASSWORD_NO_UPPER: "Add at least one uppercase letter.",
    PASSWORD_NO_LOWER: "Add at least one lowercase letter.",
    PASSWORD_NO_NUMBER: "Add at least one number.",
    PASSWORD_NO_SPECIAL: "Add a special character (e.g., @$!%*?&).",

});