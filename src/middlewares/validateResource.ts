import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod/v3';
import CONSTANTS from '../constants';
import ValidationError from '../utils/ValidationError';


const validateResource = async (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            //checking the data against schema 
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            //if everything is fine then send move the control to the next handler
            next()

        } catch (error: unknown) {//any cause we can throw anything in js string, number...
            if (error instanceof ZodError) {
                return next(new ValidationError(CONSTANTS.ERRORS.VALIDATION_FAILED, error.errors))
            }
            next(error)
        };
        return;
    }

export default validateResource;