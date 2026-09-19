import nodemailer, { Transporter } from "nodemailer";
import { IMailerService } from "./mailer.types";
import ENV from "../../config/env";
import { getOtpEmailTemplate } from "../../utils/email.templates";
import logger from "../../config/logger";



class NodemailerService implements IMailerService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ENV.SMTP_USER,
                pass: ENV.SMTP_PASS,
            }
        });
    };

    async sendOtpMail(to: string, otp: string): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Your OTP for Registration",
                html: getOtpEmailTemplate(otp)
            });
            logger.info({ email: to }, "OTP successfully sent to user");
            return true;
        } catch (error) {
            logger.error({ err: error, email: to }, "Failed to send OTP email");
            // return false so will not crash
            return false;
        };
    };
};

export default NodemailerService;