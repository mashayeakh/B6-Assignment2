import { Router } from "express";
import { UserController } from "./users.controller";
import { AuthMiddleware } from "../../middleware/auth";

const router = Router();

// router.get("/", UserController.test);
// router.post("/", UserController.createUser);




router.get("/", AuthMiddleware.auth("admin"), UserController.getAllUsers);//admin access

router.put("/:userId", AuthMiddleware.auth("admin", "customer"), UserController.updateUser); // admin or customer access

router.delete("/:userId", AuthMiddleware.auth("admin"), UserController.deleteUser);//admin access


export const UserRouter = router;