import { Model } from 'mongoose';
import { IOtpDocument } from './otp.model';
import { IOtpRepository } from './auth.types';

class OtpRepositoryImpl implements IOtpRepository {
    private model: Model<IOtpDocument>;

    constructor(model: Model<IOtpDocument>) {
        this.model = model;
    };

    //while creating new otp delete existing one first
    async createOtp(email: string, otp: string): Promise<IOtpDocument> {
        //deleting the previus one 
        await this.model.deleteMany({ email });
        //creating new one and returning
        return await this.model.create({ email, otp });
    };

    // used at the time of verification 
    async findOtp(email: string, otp: string): Promise<IOtpDocument | null> {
        return await this.model.findOne({ email, otp });
    };

    //deleting the otp after verification
    async deleteOtp(email: string): Promise<void> {
        await this.model.deleteMany({email})
    }

};

export default OtpRepositoryImpl;
