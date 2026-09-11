export interface IMailerService {
    sendOtpMail(to: string, otp: string): Promise<boolean>
}