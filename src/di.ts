//central dependency injection center 
//singleton pattern for dependency injection

import { AuthServiceImpl } from "./modules/auth/auth.service";
import { IAuthService, IOtpRepository } from "./modules/auth/auth.types";
import { OtpModel } from "./modules/auth/otp.model";
import OtpRepositoryImpl from "./modules/auth/otp.repository";
import { UserModel } from "./modules/users/user.model";
import UserRepositoryImpl from "./modules/users/user.repository";
import { IUserRepository } from "./modules/users/user.types";
import { PasswordServiceImpl } from "./services/crypto/bcryptPassoword.service";
import { IOtpService, IPasswordService, ITokenService } from "./services/crypto/crypto.types";
import { TokenServiceImpl } from "./services/crypto/jwtToken.service";
import { OtpServiceImpl } from "./services/crypto/otp.service";
import { IMailerService } from "./services/mailer/mailer.types";
import NodemailerService from "./services/mailer/nodemailer.service";
import { GoogleAuthServiceImpl } from "./services/oauth/googleAuth.service";
import { IOAuthService } from "./services/oauth/oauth.types";

class DependencyInjector {
    private static instance: DependencyInjector;

    private readonly userRepository: IUserRepository;
    private readonly otpRepository: IOtpRepository;
    private readonly mailerService: IMailerService;
    private readonly otpService: IOtpService;
    private readonly passwordService: IPasswordService;
    private readonly tokenService: ITokenService;
    private readonly oAuthService: IOAuthService;

    private readonly authService: IAuthService;
    private constructor() {
        // repositories 
        this.userRepository = new UserRepositoryImpl(UserModel);
        this.otpRepository = new OtpRepositoryImpl(OtpModel);
        //services
        this.mailerService = new NodemailerService();
        this.otpService = new OtpServiceImpl();
        this.passwordService = new PasswordServiceImpl();
        this.tokenService = new TokenServiceImpl();
        this.oAuthService = new GoogleAuthServiceImpl();
        this.authService = new AuthServiceImpl(this.userRepository, this.otpRepository, this.mailerService, this.otpService, this.passwordService, this.tokenService,this.oAuthService);
        
        //controllers
    }

    public static getInstance(): DependencyInjector {
        if (!DependencyInjector.instance) {
            DependencyInjector.instance = new DependencyInjector();
            return DependencyInjector.instance;
        }
        return DependencyInjector.instance
    }
}

export const di = DependencyInjector.getInstance();