import { Model } from "mongoose";
import { ICreateUserDTO, IUserDocument, IUserRepository } from "./user.types";

class UserRepositoryImpl implements IUserRepository {
    private model: Model<IUserDocument>;

    constructor(model: Model<IUserDocument>) {
        this.model = model;
    };
    //create
    async create(data: ICreateUserDTO): Promise<IUserDocument> {
        return await this.model.create(data);
    };
    //find
    async findById(id: string): Promise<IUserDocument | null> {
        return await this.model.findById(id);
    };

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return await this.model.findOne({ email });
    };

    //update
    async updateById(id: string, data: Partial<IUserDocument>): Promise<IUserDocument | null> {
        return await this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    };

    //delete
    async deleteById(id: string): Promise<IUserDocument | null> {
        return await this.model.findByIdAndDelete(id);
    };

    //Admin : find All
    async findAll(): Promise<IUserDocument[]> {
        return await this.model.find();
    }

};

export default UserRepositoryImpl;