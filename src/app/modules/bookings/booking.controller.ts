import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { json } from "stream/consumers";
import { catchAsync } from "../../middleware/catchAsync";

export const BookingController = {


    //create booking
    createBooking: catchAsync(async (req, res) => {
        const result = await BookingService.createBooking(req.body);
        res.status(result.statusCode || 201).json(result)
    }),


    //get all booking
    getAllBooking: catchAsync(async (req, res) => {
        const result = await BookingService.getAllBookings(req, res);
        res.status(200).json(result)
    }),


    //update booking
    updateBooking: catchAsync(async (req, res) => {
        const bookingId = Number(req.params.bookingId);
        const result = await BookingService.updateBooking(bookingId, req.user, req.body);
        res.status(200).json(result)
    }),




}