import { Router } from "express";
import { BookingController } from './booking.controller';
import { AuthMiddleware } from "../../middleware/auth";

const router = Router();


router.post("/", AuthMiddleware.auth("admin", "customer"), BookingController.createBooking);//admin or customer

router.get("/", AuthMiddleware.auth("admin", "customer"), BookingController.getAllBooking); //both roles

router.put("/:bookingId", AuthMiddleware.auth("customer", "admin"), BookingController.updateBooking); //both roles


export const BookingRouter = router;