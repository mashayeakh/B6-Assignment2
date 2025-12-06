import { Request, Response } from "express";
import { BookingService } from "./booking.service";

export const BookingController = {
    async test(req: Request, res: Response) {
        const result = await BookingService.test();
        res.status(result.statusCode).json(result)
    },

    async createBooking(req: Request, res: Response) {
        try {
            const result = await BookingService.createBooking(req.body);

            res.status(result.status || 201).json(result)
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
            const result = await BookingService.getAllBookings(req, res);
            res.status(200).json(result)
        } catch (err: any) {
            return {
                success: false,
                message: "Internal Server Error	",
                statusCode: 500,
            }
        }
    },




}