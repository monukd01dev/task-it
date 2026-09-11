export const getOtpEmailTemplate = (otp: string): string => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0;">Task.it</h2>
            <p style="color: #666; margin-top: 5px;">Your Personal Productivity Partner</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">Authentication Code</h3>
            <p style="color: #555; font-size: 16px;">Please use the following OTP to verify your account.</p>
            
            <div style="background-color: #fff; border: 2px dashed #2563eb; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">${otp}</span>
            </div>
            
            <p style="color: #ef4444; font-size: 14px;">⏳ This code will expire in 5 minutes.</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>&copy; ${new Date().getFullYear()} Task.it. All rights reserved.</p>
        </div>
    </div>
    `;
};