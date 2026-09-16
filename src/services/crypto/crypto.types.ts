
export interface ITokenPayload {
    userId: string,
    email: string,
    role: string,
};

export interface IPasswordService {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
};

export interface ITokenService {
    generateAccessToken(payload: ITokenPayload): string;
    generateRefreshToken(payload: ITokenPayload): string;
    verifyAccessToken(token: string): ITokenPayload; 
    verifyRefreshToken(token: string): ITokenPayload;
};

export interface IOtpService {
    generate(): string
};