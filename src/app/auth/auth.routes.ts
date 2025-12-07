import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/test", AuthController.test);

router.post("/signup", AuthController.signup);//public

router.post("/signin", AuthController.signin);//public

export const AuthRouter = router;