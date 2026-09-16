import { IOtpService } from "./crypto.types";
import crypto from 'crypto';


export class OtpServiceImpl implements IOtpService {
    public generate(): string {
        return crypto.randomInt(100000, 999999).toString();
    }
}