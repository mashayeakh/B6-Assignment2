import { Request, Response } from "express";
import { UserService } from "./users.service";

export const UserController = {
    async test(req: Request, res: Response) {
        const result = await UserService.test();
        res.status(result.statusCode).json(result)
    },


    async getAllUsers(req: Request, res: Response) {
        const users = await UserService.getAllUser();
        res.status(200).json(users)
    },


    async updateUser(req: Request, res: Response) {
        // const { name, email, password, phone, role } = req.body;
        const result = await UserService.updateUser(Number(req.params.userId), req.user, req.body);

        res.status(200).json(result);
    },


    async deleteUser(req: Request, res: Response) {
        const result = await UserService.deleteUser(Number(req.params.id));
        res.status(200).json(result);
    }
}