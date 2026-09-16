import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { IMailerService } from "../../services/mailer/mailer.types";
import AppError from "../../utils/AppError";
import { IUserRepository } from "../users/user.types";
import { GoogleAuthInput, IAuthService, IOtpRepository, LoginInput, SignupInput, VerfiyOtpInput } from "./auth.types";
import { IOtpService, IPasswordService, ITokenService } from "../../services/crypto/crypto.types";
import logger from "../../config/logger";
import { getOtpEmailTemplate } from "../../utils/email.templates";


export class AuthServiceImpl implements IAuthService {
    private readonly userRepository: IUserRepository;
    private readonly otpRepository: IOtpRepository;
    private readonly mailerService: IMailerService;
    private readonly otpService: IOtpService;
    private readonly passwordService: IPasswordService;
    private readonly tokenService: ITokenService;
    constructor(
        userRepository: IUserRepository,
        otpRepository: IOtpRepository,
        mailerService: IMailerService,
        otpService: IOtpService,
        passwordService: IPasswordService,
        tokenService: ITokenService,
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.mailerService = mailerService;
        this.otpService = otpService;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }

    async signup(signupData: SignupInput): Promise<void> {
        const { name, email, password } = signupData;

        // 1. Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            if (existingUser.isVerified) {
                logger.error({email}, "Verified user trying to singup again")
                throw new AppError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
            }
            // if user already exist but not verfied hash the new password and update the existing detail and continue the otp flow
            const newHashedPassword = await this.passwordService.hash(password);
            await this.userRepository.updateById(existingUser._id.toString(), { password: newHashedPassword });

            logger.info({email},"New password created and existing unverified user password updated")

        } else {
            // 2. Hash the password using injected service
            const hashedPassword = await this.passwordService.hash(password);
            
            // 3. Create unverified user
            await this.userRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            logger.info({ email }, "New unverified user created in DB");
        }



        // 4. Generate and save OTP
        const generatedOtpValue = this.otpService.generate();
        const otpRecord = await this.otpRepository.createOtp(email, generatedOtpValue);

        // 5. Send OTP Mail with HTML template
        const htmlContent = getOtpEmailTemplate(otpRecord.otp);
        const mailSent = await this.mailerService.sendOtpMail(otpRecord.email, htmlContent);

        if (!mailSent) {
            logger.error({ email }, "Failed to send OTP email during signup");
            throw new AppError("Failed to send verification email", StatusCodes.INTERNAL_SERVER_ERROR);
        }

        logger.info({ email }, "Signup successful, OTP email sent");
    }

    async resendOtp(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || user.isVerified) {
            logger.error({email},"Verified user tried to resend otp.")
            throw new AppError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
        }

        // Cooldown Logic (Anti-Spam)
        const existingOtp = await this.otpRepository.findOtpByEmail(email); // findOne method
        if (existingOtp) {
            const timeDiff = new Date().getTime() - existingOtp.createdAt.getTime();
            const oneMinute = 60 * 1000;

            if (timeDiff < oneMinute) {
                // if time difference is less than 1m then 
                throw new AppError("Please wait 1 minute before requesting another OTP", StatusCodes.TOO_MANY_REQUESTS); // 429
            }
        }

        // Generate New OTP (all old otps will be deleted)
        const generatedOtpValue = this.otpService.generate();
        const otpRecord = await this.otpRepository.createOtp(email, generatedOtpValue);
        logger.info({email},"New Otp generated.")
        // Send Mail
        const mailSent = await this.mailerService.sendOtpMail(otpRecord.email, getOtpEmailTemplate(otpRecord.otp));
        if (!mailSent) {
            logger.error({ email }, "Failed to send OTP email during resend otp.");
            throw new AppError(ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        logger.info({email}, "Resend Otp email send successfully")
    }

    async verifyOtp(verifyData: VerfiyOtpInput): Promise<string> {
        return ""
    }

    async login(loginData: LoginInput): Promise<string> {
        return ""
    }

    async googleAuth(googleAuthData: GoogleAuthInput): Promise<string> {
        return ""
    }
}