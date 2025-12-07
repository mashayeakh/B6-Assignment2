//For any internal issue.. 
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (error: any, req: Request, res: Response, next:NextFunction) => {

    console.log("Error ", error)


    res.status(error.statusCode || 500).json({
        success:false, 
        message:error.message || "Internal server error",  
    })

}