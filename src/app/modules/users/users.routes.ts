import { Router } from "express";
import { UserController } from "./users.controller";
import { AuthMiddleware } from "../../middleware/auth";

const router = Router();

// router.get("/", UserController.test);
router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);

export const UserRouter = router;