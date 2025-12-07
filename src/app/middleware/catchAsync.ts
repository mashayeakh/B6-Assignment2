//This file handles try/catch automatically so that we dont need to write eveyrytime

import { NextFunction, Request, Response } from "express";

export const catchAsync = (fn: (req:Request, res:Response, next?:NextFunction)=>Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
    // next();
}