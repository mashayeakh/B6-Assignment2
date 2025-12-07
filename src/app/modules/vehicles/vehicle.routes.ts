import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import { AuthMiddleware } from './../../middleware/auth';

const router = Router();


router.post("/", AuthMiddleware.auth("admin"), VehicleController.createVehicle);//only admin

router.get("/", VehicleController.getAllVehicle); //public

router.get("/:vehicleId", VehicleController.getVehicleById);//public

router.put("/:vehicleId", AuthMiddleware.auth("admin"), VehicleController.updateVehicle);//admin

router.delete("/:vehicleId", AuthMiddleware.auth("admin"), VehicleController.deleteVehicle);//admin


export const VehicleRouter = router;