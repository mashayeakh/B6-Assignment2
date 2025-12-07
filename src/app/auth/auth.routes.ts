import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();


router.post("/signup", AuthController.signup);//public

router.post("/signin", AuthController.signin);//public

export const AuthRouter = router;