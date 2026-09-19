import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { IMailerService } from "../../services/mailer/mailer.types";
import AppError from "../../utils/AppError";
import { IUserRepository } from "../users/user.types";
import { AuthTokens, GoogleAuthInput, IAuthService, IOtpRepository, LoginInput, SignupInput, VerfiyOtpInput } from "./auth.types";
import { IOtpService, IPasswordService, ITokenPayload, ITokenService } from "../../services/crypto/crypto.types";
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

    async verifyOtp(verifyData: VerfiyOtpInput): Promise<AuthTokens> {
        const { email, otp } = verifyData;

        // 1. Find User
        const existingUser = await this.userRepository.findByEmail(email);
        if (!existingUser) {
            logger.warn({ email }, "OTP verification attempted for non-existent user");
            throw new AppError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
        }

        // 2. Security Check: Already Verified?
        if (existingUser.isVerified) {
            logger.info({ email }, "Already verified user tried to verify again");
            throw new AppError("User is already verified. Please login.", StatusCodes.CONFLICT);
        }

        // 3. Find OTP
        const existingOtp = await this.otpRepository.findOtp(email, otp);
        if (!existingOtp) {
            logger.warn({ email }, "Failed OTP verification attempt");
            throw new AppError("Invalid or expired OTP", StatusCodes.BAD_REQUEST);
        }

        // 4. Delete OTP (Ab yeh consume ho gaya)
        await this.otpRepository.deleteOtp(email);

        // 5. Update User Status
        const verifiedUser = await this.userRepository.updateById(
            existingUser._id.toString(), 
            { isVerified: true }
        );

        // Failsafe: if update fails (DB issue)
        if (!verifiedUser) {
            logger.error({email},"Failed to update user status")
            throw new AppError(ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // 🔥 6. Generate Tokens
        const tokenPayload: ITokenPayload = {
            userId: verifiedUser._id.toString(),
            email: verifiedUser.email,
            role: verifiedUser.role
        };

        const accessToken = this.tokenService.generateAccessToken(tokenPayload);
        const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

        logger.info({ email }, "User successfully verified and tokens generated");

        // 7. Return Both Tokens
        return {
            accessToken,
            refreshToken
        };
    }

    async login(loginData: LoginInput): Promise<AuthTokens> {
        const {email, password} = loginData;

        //1. find the user 
        const user = await this.userRepository.findByEmail(email);

        //check if user exists
        if(!user){
            logger.warn({email},"Login failed: User not found.");
            throw new AppError("Invalid email or password.",StatusCodes.UNAUTHORIZED);
        };

        //2. google OAuth user trying to local login 
        if(!user?.password){
            logger.warn({email},"Login failed: Attempted local login on Google Auth account.");
            throw new AppError("Please login using Google.",StatusCodes.BAD_REQUEST);
        };

        //3. isVerfied check 
        if(!user.isVerified){
            logger.warn({email},"Login failed : Unverified account.");
            throw new AppError("Account pending for verification. Please verify your OTP.",StatusCodes.FORBIDDEN);
        };

        //4. isPassword match 
        const isPasswordValid = await this.passwordService.compare(password,user.password);
        if(!isPasswordValid){
            logger.warn({email},"Login failed: Incorrect password");
            throw new AppError("Invalid email or password.",StatusCodes.UNAUTHORIZED);
        };
        //token payload creation
        const tokenPayload:ITokenPayload = {
            userId : user._id.toString(),
            email : user.email,
            role : user.role,
        };

        //5. creating tokens
        const accessToken = this.tokenService.generateAccessToken(tokenPayload);
        const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

        logger.info({ email }, "User logged in successfully");

        return {
            accessToken,
            refreshToken
        };

    }

    async googleAuth(googleAuthData: GoogleAuthInput): Promise<AuthTokens> {
        const {idToken} = googleAuthData;
        try{
            
        }catch(error){

        }
    }
}