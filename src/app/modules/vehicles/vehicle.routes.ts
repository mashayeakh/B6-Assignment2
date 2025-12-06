import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import { AuthMiddleware } from './../../middleware/auth';

const router = Router();

router.get("/test", VehicleController.test);
router.post("/", AuthMiddleware.auth("admin"), VehicleController.createVehicle);
router.get("/", VehicleController.getAllVehicle);
router.get("/:vehicleId", VehicleController.getVehicleById);
router.put("/:vehicleId", AuthMiddleware.auth("admin"), VehicleController.updateVehicle);
router.delete("/:vehicleId", AuthMiddleware.auth("admin"), VehicleController.deleteVehicle);

export const VehicleRouter = router;