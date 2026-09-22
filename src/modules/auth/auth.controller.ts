import { Request, Response, NextFunction } from "express";
import { IAuthService } from "./auth.types";
import { AsyncRequestHandler } from "../../types/express.types";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../utils/ApiResponse";
import CONSTANTS from "../../constants";


export class AuthController {

    private readonly authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    // ==========================================
    //  SignUp
    // ==========================================
    public signup: AsyncRequestHandler = async (req, res, next) => {
        try {
            const signupData = req.body;

            await this.authService.signup(signupData);

            return res.status(StatusCodes.CREATED).json(
                ApiResponse.success("Signup successful. OTP has been sent to your email.")
            )

        } catch (error) {
            next(error)
        }
    }

    // ==========================================
    //  Resend OTP
    // ==========================================
    public resendOtp: AsyncRequestHandler = async (req, res, next) => {
        try {

            const resendData = req.body;

            await this.authService.resendOtp(resendData);

            return res.status(StatusCodes.OK).json(
                ApiResponse.success("A new OTP has been sent to your email.")
            )

        } catch (error) {
            next(error)
        }
    }

    // ==========================================
    //  Verify OTP
    // ==========================================
    public verifyOtp: AsyncRequestHandler = async (req, res, next) => {
        try {

            const verifyData = req.body;

            const { accessToken, refreshToken } = await this.authService.verifyOtp(verifyData);

            //refresh token will be http-only
            res.cookie('refreshToken', refreshToken, CONSTANTS.REFRESH_TOKEN_COOKIE_OPTIONS);


            return res.status(StatusCodes.OK).json(
                ApiResponse.success(
                    "Account verified successfully.",
                    { accessToken }
                )
            )

        } catch (error) {
            next(error)
        }
    }

    // ==========================================
    //  LogIn
    // ==========================================
    public login: AsyncRequestHandler = async (req, res, next) => {
        try {
            const loginData = req.body;
            const { accessToken, refreshToken } = await this.authService.login(loginData);

            res.cookie('refreshToken', refreshToken, CONSTANTS.REFRESH_TOKEN_COOKIE_OPTIONS);

            return res.status(StatusCodes.OK).json(
                ApiResponse.success(
                    "Login successful.",
                    { accessToken }
                )
            )
        } catch (error) {
            next(error)
        }
    }

    // ==========================================
    //  Google Auth
    // ==========================================
    public googleAuth: AsyncRequestHandler = async (req, res, next) => {
        try {
            const googleAuthData = req.body;
            const { accessToken, refreshToken } = await this.authService.googleAuth(googleAuthData);

            res.cookie('refreshToken', refreshToken, CONSTANTS.REFRESH_TOKEN_COOKIE_OPTIONS);

            return res.status(StatusCodes.OK).json(
                ApiResponse.success(
                    "Google Authentication successful.",
                    { accessToken }
                )
            )

        } catch (error) {
            next(error)
        }
    }

    // ==========================================
    //  LogOut
    // ==========================================
    public logout: AsyncRequestHandler = async (req, res, next) => {
        try {
            // we just have to clear the cookie
            res.clearCookie('refreshToken', CONSTANTS.CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS);

            res.status(StatusCodes.OK).json(
                ApiResponse.success("Logged out successfully.")
            );

        } catch (error) {
            next(error)
        }
    }

}