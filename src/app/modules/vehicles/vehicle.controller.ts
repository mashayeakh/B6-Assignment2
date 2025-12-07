import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";
import { catchAsync } from "../../middleware/catchAsync";





export const VehicleController = {

    //create vehicle
    createVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.createVehicle(req.body);
        res.status(201).json(result);
    }),


    //get all vehicle
    getAllVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.getAllVehicles();
        res.status(200).json(result)
    }),


    //get vehicle by id
    getVehicleById: catchAsync(async (req, res) => {
        const result = await VehicleService.getVehicleById(Number(req.params.vehicleId));
        res.status(200).json(result)
    }),


    //update vehicle
    updateVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
        res.status(200).json(result)
    }),

    //delete vehicle
    deleteVehicle: catchAsync(async (req, res) => {
        const result = await VehicleService.deleteVehicle(Number(req.params.vehicleId));
        res.status(200).json(result)
    }),

    

}