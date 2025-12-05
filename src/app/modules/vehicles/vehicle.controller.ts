import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";
import { catchAsync } from "../../utils/catchAsync";





export const VehicleController = {

    test: catchAsync(async (req, res) => {
        const result = await VehicleService.test();
        res.status(result.statusCode).json(result)
    }),


    createVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.createVehicle(req.body);
        res.status(201).json(result);
    }),

    // async createVehicle(req: Request, res: Response) {
    //     try {
    //         const result = await VehicleService.createVehicle(req.body);

    //         res.status(201).json(result)
    //     } catch (err: any) {
    //         return {
    //             success: false,
    //             message: "Internal Server Error	",
    //             statusCode: 500,
    //         }
    //     }
    // },


    getAllVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.getAllVehicles();
        res.status(200).json(result)
    }),


    // async getAllVehicle(req: Request, res: Response) {
    //     try {
    //         const result = await VehicleService.getAllVehicles();
    //         res.status(200).json(result)
    //     } catch (err: any) {
    //         return {
    //             success: false,
    //             message: "Internal Server Error	",
    //             statusCode: 500,
    //         }
    //     }
    // },


    getVehicleById: catchAsync(async (req, res) => {
        const result = await VehicleService.getVehicleById(Number(req.params.vehicleId));
        res.status(200).json(result)
    }),


    // async getVehicleById(req: Request, res: Response) {
    //     try {

    //         const result = await VehicleService.getVehicleById(Number(req.params.vehicleId));
    //         res.status(200).json(result)

    //     } catch (err: any) {
    //         return {
    //             success: false,
    //             message: "Internal Server Error	",
    //             statusCode: 500,
    //         }
    //     }
    // },


    updateVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
        res.status(200).json(result)
    }),

    // async updateVehicle(req: Request, res: Response) {
    //     try {
    //         const result = await VehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
    //         res.status(200).json(result)
    //     } catch (err: any) {
    //         return {
    //             success: false,
    //             message: "Internal Server Error	",
    //             statusCode: 500,
    //         }
    //     }
    // },

    deleteVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.deleteVehicle(Number(req.params.vehicleId));
        res.status(200).json(result)
    }),

    // async deleteVehicle(req: Request, res: Response) {
    //     try {
    //         const result = await VehicleService.deleteVehicle(Number(req.params.vehicleId));
    //         res.status(200).json(result)
    //     } catch (err: any) {
    //         return {
    //             success: false,
    //             message: "Internal Server Error	",
    //             statusCode: 500,
    //         }
    //     }
    // }



}