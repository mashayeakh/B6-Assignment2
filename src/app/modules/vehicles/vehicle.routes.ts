import { Router } from "express";
import { VehicleController } from "./vehicle.controller";

const router = Router();

// router.get("/", UserController.test);
router.post("/", VehicleController.createVehicle);
router.get("/", VehicleController.getAllVehicle);
router.get("/:vehicleId", VehicleController.getVehicleById);
router.put("/:vehicleId", VehicleController.updateVehicle);
router.delete("/:vehicleId", VehicleController.deleteVehicle);

export const VehicleRouter = router;