import { pool } from "../../config/db";

export const VehicleService = {
    async test() {
        return {
            success: "true",
            message: "hello, testing 1,2,3....",
            statusCode: 200
        }
    },

    //create vehicle
    async createVehicle(payload: any) {
        try {

            const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

            console.log({ "payload data from body ": payload })

            //insert values into user table
            const insertion = await pool.query(
                `
                INSERT INTO Vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
                `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
            )

            console.log("Respoine ", insertion)

            return {
                success: true,
                "message": "Vehicle created successfully",
                data: insertion.rows[0],
                // statusCode: 201,
            }
        } catch (error: any) {


            return {
                success: false,
                statusCode: 400,
                message: error.message || "Something went wrong"
            }
        }
    },

    //all vehicle
    async getAllVehicles() {
        const result = await pool.query(
            `
            SELECT * FROM Vehicles
            `
        )
        // console.log("REsulst", result)
        return {
            "success": true,
            "message": "Vehicles retrieved successfully",
            "data": result.rows,
        }
    },

    //get vehicle by id
    async getVehicleById(vehicleId: number | string) {
        const result = await pool.query(
            `
            SELECT * FROM Vehicles WHERE id=$1
            `, [vehicleId]
        )

        return {
            "success": true,
            "message": "Vehicle retrieved successfully",
            "data": result.rows[0],
        }

    }


}

