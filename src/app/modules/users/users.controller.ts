import { Request, Response } from "express";
import { UserService } from "./users.service";

export const UserController = {
    async test(req: Request, res: Response) {
        const result = await UserService.test();
        res.status(result.statusCode).json(result)
    },

    async createUser(req: Request, res: Response) {
        try {
            const demo = await UserService.createDemoUser(req.body);

            res.status(demo.statusCode as number).json(demo)
        } catch (err: any) {
            return {
                success: false,
                message: "Internal Server Error	",
                statusCode: 500,
            }
        }
    },

    async getAllUsers(req: Request, res: Response) {
        const users = await UserService.getAllUser();
        res.status(200).json(users)
    }


}