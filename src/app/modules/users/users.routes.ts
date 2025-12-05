import { Router } from "express";
import { UserController } from "./users.controller";

const router = Router();

router.get("/", UserController.test);
router.post("/", UserController.createUser);
// router.get("/", UserController.);

export const UserRouter = router;