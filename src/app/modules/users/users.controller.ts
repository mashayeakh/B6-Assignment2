import { Request, Response } from "express";
import { UserService } from "./users.service";
import { catchAsync } from "../../middleware/catchAsync";

export const UserController = {


    getAllUsers: catchAsync(async (req, res) => {
        const users = await UserService.getAllUser();
        res.status(200).json(users)
    }),

    // async getAllUsers(req: Request, res: Response) {
    //     const users = await UserService.getAllUser();
    //     res.status(200).json(users)
    // },


    updateUser: catchAsync(async (req, res) => {
        // const { name, email, password, phone, role } = req.body;
        const result = await UserService.updateUser(Number(req.params.userId), req.user, req.body);
        res.status(200).json(result);
    }),


    // async updateUser(req: Request, res: Response) {
    //     // const { name, email, password, phone, role } = req.body;
    //     const result = await UserService.updateUser(Number(req.params.userId), req.user, req.body);
    //     res.status(200).json(result);
    // },

    deleteUser: catchAsync(async (req, res) => {
        const result = await UserService.deleteUser(Number(req.params.userId));
        res.status(200).json(result);
    }),

    // async deleteUser(req: Request, res: Response) {
    //     const result = await UserService.deleteUser(Number(req.params.userId));
    //     res.status(200).json(result);
    // }
}