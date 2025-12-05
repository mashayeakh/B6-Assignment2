import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

export const VehicleController = {
    async test(req: Request, res: Response) {
        const result = await VehicleService.test();
        res.status(result.statusCode).json(result)
    },

    async createVehicle(req: Request, res: Response) {
        try {
            const result = await VehicleService.createVehicle(req.body);

            res.json(result)
        } catch (err: any) {
            return {
                success: false,
                message: "Internal Server Error	",
                statusCode: 500,
            }
        }

    },

    async getAllVehicle(req: Request, res: Response) {
        try {
            const result = await VehicleService.getAllVehicles();
            res.json(result)
        } catch (err: any) {
            return {
                success: false,
                message: "Internal Server Error	",
                statusCode: 500,
            }
        }
    },

    async getVehicleById(req: Request, res: Response) {
        try {
            const result = await VehicleService.getVehicleById(req.params.id as number | string);
            res.status(200).json(result)

        } catch (err: any) {
            return {
                success: false,
                message: "Internal Server Error	",
                statusCode: 500,
            }
        }
    }


}