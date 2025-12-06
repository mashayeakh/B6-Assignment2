import { Router } from "express";
import { BookingController } from './booking.controller';
import { AuthMiddleware } from "../../middleware/auth";

const router = Router();

// router.get("/test", BookingController.test);
router.post("/", AuthMiddleware.auth("admin", "customer"), BookingController.createBooking);
router.get("/", AuthMiddleware.auth("admin", "customer"), BookingController.getAllVehicle);

export const BookingRouter = router;