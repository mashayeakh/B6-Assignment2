//declaring type
import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

//we can get the req.user like req.body, req.params....