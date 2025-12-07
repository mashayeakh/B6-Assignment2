import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../middleware/catchAsync";

export const AuthController = {

    //signup

    signup: catchAsync(async (req, res) => {
        const result = await AuthService.userSignup(req.body);
        res.status(result.statusCode || 201).json(result);
    }),

    // async signup(req: Request, res: Response) {
    //     const result = await AuthService.userSignup(req.body);
    //     res.status(result.statusCode || 201).json(result);
    // },

    //singin 

    signin: catchAsync(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.userSignin(email, password);
        res.status(200).json(result);
    }),

    // async signin(req: Request, res: Response) {
    //     const { email, password } = req.body;
    //     const result = await AuthService.userSignin(email, password);
    //     res.status(200).json(result);
    // }

}