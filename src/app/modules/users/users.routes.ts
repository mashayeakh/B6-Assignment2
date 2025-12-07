import { Router } from "express";
import { UserController } from "./users.controller";
import { AuthMiddleware } from "../../middleware/auth";

const router = Router();

// router.get("/", UserController.test);
// router.post("/", UserController.createUser);




router.get("/", AuthMiddleware.auth("admin"), UserController.getAllUsers);

router.put("/:userId", AuthMiddleware.auth("admin", "customer"), UserController.updateUser);

router.delete("/:userId", AuthMiddleware.auth("admin"), UserController.deleteUser);


export const UserRouter = router;