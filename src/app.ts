import express from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/users/users.routes";
import { VehicleRouter } from "./app/modules/vehicles/vehicle.routes";
import { globalErrorHandler } from "./app/middleware/errorHandler";

//express
const app = express();

//cors
app.use(cors());

//global error handler
app.use(globalErrorHandler);

//json
app.use(express.json());

//api
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/vehicles", VehicleRouter);

export default app;