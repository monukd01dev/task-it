import { StatusCodes } from "http-status-codes";
import AppError from "./AppError";
import * as z from "zod";


class ValidationError extends AppError {
    public readonly fields: { field: string, message: string }[];

    constructor(message: string, zodError: z.ZodError) {
        super(message, StatusCodes.BAD_REQUEST);
        this.fields = zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }))
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ValidationError;