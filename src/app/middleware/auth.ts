import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

export const AuthMiddleware = {
    auth(...roles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers.authorization;

                // No token provided
                if (!authHeader) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication token missing"
                    });
                }

                // "Bearer <token>"
                const token = authHeader.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        message: "Token missing"
                    });
                }

                // Verify token
                const verifiedToken = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

                // Attach user info to request - This is customized in types folder
                req.user = verifiedToken;

                // Check for role
                if (roles.length && !roles.includes(verifiedToken.role)) {
                    return res.status(403).json({
                        success: false,
                        message: "Forbidden: Valid token but insufficient permissions"
                    });
                }

                next();

            } catch (error: any) {
                return res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error"
                });
            }
        };
    }
};
