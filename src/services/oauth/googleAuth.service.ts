import { OAuth2Client } from "google-auth-library";
import { IOAuthPayload, IOAuthService } from "./oauth.types";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import ENV from "../../config/env";
import logger from "../../config/logger";


export class GoogleAuthServiceImpl implements IOAuthService {

    private readonly client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);
    };

    async verifyIdToken(idToken: string): Promise<IOAuthPayload> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.email || !payload.sub) {
                logger.warn({ payload }, "Invalid Google Token Payload")
                throw new AppError("Invalid Google Token Payload", StatusCodes.UNAUTHORIZED);
            }

            // Map Google's payload to our system's interface
            return {
                email: payload.email,
                name: payload.name,
                sub: payload.sub
            };
        } catch (error) {

            if(error instanceof AppError){
                throw error
            }
            logger.error({ error }, "Google token verification failed.")
            throw new AppError("Google token verification failed", StatusCodes.UNAUTHORIZED);
        }
    }
}