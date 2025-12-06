import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
    async test(req: Request, res: Response) {
        const result = await AuthService.test();
        res.status(result.statusCode).json(result)
    },

    //signup
    async signup(req: Request, res: Response) {
        const result = await AuthService.userSignup(req.body);
        res.status(result.statusCode || 201).json(result);
    }

}