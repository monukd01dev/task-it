import { Request, Response, NextFunction } from 'express';
import * as z from 'zod';
import CONSTANTS from '../constants';
import ValidationError from '../utils/ValidationError';


const validateResource = (schema: z.ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //checking the data against schema 
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            //if everything is fine then send move the control to the next handler
            next()

        } catch (error: unknown) {//any cause we can throw anything in js string, number...
            if (error instanceof z.ZodError) {
                return next(new ValidationError(CONSTANTS.ERRORS.VALIDATION_FAILED, error))
            }
            next(error)
        };

    }

export default validateResource;