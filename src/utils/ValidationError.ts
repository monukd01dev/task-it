import { StatusCodes } from "http-status-codes";
import AppError from "./AppError";
import { ZodIssue } from "zod/v3";


class ValidationError extends AppError {
    public readonly fields: { field: string, message: string }[];

    constructor(message: string, zodError: ZodIssue[]) {
        super(message, StatusCodes.BAD_REQUEST);
        this.fields = zodError.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }))
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ValidationError;