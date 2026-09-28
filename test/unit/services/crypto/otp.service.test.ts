import { describe, it, expect } from "vitest";
import { OtpServiceImpl } from '@/services/crypto/otp.service';
import { IOtpService } from "@/services/crypto/crypto.types";

describe("OtpService", () => {
    const otpService: IOtpService = new OtpServiceImpl();

    //no need to run beforeEach i guess and behind the scene its only using crypto.randomInt() means there is nothing so we need to run before each 

    describe('generate()', () => {

        it('should return a string of exactly 6 characters', () => {
            const otp = otpService.generate();

            expect(typeof otp).toBe('string');
            expect(otp.length).toBe(6);
        });

        it('should only contain numeric digits', () => {
            const otp = otpService.generate();

            expect(otp).toMatch(/^[0-9]+$/);
        });

        it('should generate random values on subsequent calls', () => {
            const opt_1 = otpService.generate();
            const opt_2 = otpService.generate();

            expect(opt_1).not.toEqual(opt_2);
        });
    });
});