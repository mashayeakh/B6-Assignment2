import { Router } from "express";
import { BookingController } from './booking.controller';

const router = Router();

router.get("/test", BookingController.test);
router.post("/", BookingController.createBooking);
// router.get("/", BookingController.);

export const BookingRouter = router;