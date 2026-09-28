import jwt from 'jsonwebtoken';
import { ITokenPayload, ITokenService } from './crypto.types';
import ENV from '../../config/env';

type ExpiresIn = jwt.SignOptions['expiresIn'];

export class TokenServiceImpl implements ITokenService {
    private readonly accessSecret = ENV.JWT_SECRET;
    private readonly refreshSecret = ENV.JWT_REFRESH_SECRET;
    private readonly jwtAlgorithm: jwt.Algorithm = 'HS256';
    private readonly accessExpiresIn: ExpiresIn = ENV.JWT_ACCESS_EXPIRES_IN as ExpiresIn;
    private readonly refreshExpiresIn: ExpiresIn = ENV.JWT_REFRESH_EXPIRES_IN as ExpiresIn;

    public generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.accessSecret, {
            algorithm: this.jwtAlgorithm,
            expiresIn: this.accessExpiresIn
        });
    };

    public generateRefreshToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.refreshSecret, {
            algorithm: this.jwtAlgorithm,
            expiresIn: this.refreshExpiresIn
        });
    }

    public verifyAccessToken(token: string): ITokenPayload {
        return jwt.verify(token, this.accessSecret) as ITokenPayload;
    }

    public verifyRefreshToken(token: string): ITokenPayload {
        return jwt.verify(token, this.refreshSecret) as ITokenPayload;
    }
}