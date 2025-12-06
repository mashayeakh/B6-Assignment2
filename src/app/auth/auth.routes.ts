import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/test", AuthController.test);
router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);

export const AuthRouter = router;