import { Document } from "mongoose";



export interface IUserDocument extends Document {
    name: string,
    email: string,
    password?: string,
    googleId?: string,
    role: "user" | "admin",
    isVarified: boolean,
    tokenVersion: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface ICreateUserDTO {
    name: string,
    email: string,
    password?: string,
    googleId?: string,
}

export interface IUserRepository {
    create(data: ICreateUserDTO): Promise<IUserDocument>;
    findByEmail(email: string): Promise<IUserDocument | null>;
    findById(id: string): Promise<IUserDocument | null>;
    updateById(id: string, data: Partial<IUserDocument>): Promise<IUserDocument | null>;
    deleteById(id: string): Promise<IUserDocument | null>;
    findAll(): Promise<IUserDocument[]>;
}