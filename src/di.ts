//central dependency injection center 
//here we use singleton pattern to for dependency injection

import { IOtpRepository } from "./modules/auth/auth.types";
import { OtpModel } from "./modules/auth/otp.model";
import OtpRepositoryImpl from "./modules/auth/otp.repository";
import { UserModel } from "./modules/users/user.model";
import UserRepositoryImpl from "./modules/users/user.repository";
import { IUserRepository } from "./modules/users/user.types";

class DependencyInjector {
    private static instance: DependencyInjector;

    public readonly userRepository: IUserRepository;
    public readonly otpRepository: IOtpRepository;

    private constructor() {
        //creating repositories with their required models
        this.userRepository = new UserRepositoryImpl(UserModel);
        this.otpRepository = new OtpRepositoryImpl(OtpModel);
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