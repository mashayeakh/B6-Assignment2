import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "../config";

export const AuthMiddleware = {


    auth(...role: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            //this will take place in user routes as i have role based authentication
            try {
                //how to get the 
                const authHeader = req.headers.authorization;

                //if you have no token then you cant access to the routes
                if (!authHeader) {
                    return res.status(500).json({
                        message: "you are not allowed"
                    });
                }

                // "Bearer <token>"
                const token = authHeader.split(" ")[1];
                if (!token) {
                    return res.status(401).json({ message: "Token missing" });
                }

                //if exists, then verify the token. with whome? with the secrect you put in env
                const verifiedToken = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

                console.log("verified token ", verifiedToken)

                // we have declared a type and set the user in the req. because whenever we need to use this anywhere to compare with the email and password
                req.user = verifiedToken;

                //check for role
                if (role.length && !role.includes(verifiedToken.role)) {
                    return res.status(500).json({
                        success: false,
                        error: "unauthorized"
                    })
                }

                next();

            } catch (error: any) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }


}