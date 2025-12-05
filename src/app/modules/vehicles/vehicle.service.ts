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

            // console.log({ "payload data from body ": payload })

            //insert values into user table
            const insertion = await pool.query(
                `
                INSERT INTO Vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
                `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
            )

            // console.log("Respoine ", insertion)

            return {
                success: true,
                "message": "Vehicle created successfully",
                data: insertion.rows[0],
            }
        } catch (error: any) {

            // console.log("Err ", error)

            //if any require field is missing - (23502)
            if (error.code === "23502") {
                console.log("ERRR ", error?.column)
                return {
                    success: false,
                    message: `${error?.column} is missing`,
                    statusCode: 400
                }
            }

            //unique value issue. - (23505)
            if (error.code === "23505") {
                return {
                    success: false,
                    message: `registration_number already exist`,
                    statusCode: 400
                }
            }
            //constraint check
            if (error.code === "23514") {
                console.log("ERR ", error)
                //type issue
                if (error.constraint === "vehicle_type_check") {
                    return {
                        success: false,
                        message: `Type must be one of: car, bike, van, SUV`,
                        statusCode: 400,
                    }
                }
                //status check
                if (error.constraint === "status_check") {
                    return {
                        success: false,
                        message: `Availability status must be 'available' or 'booked'`,
                        statusCode: 400,
                    }
                }
                //price positive check
                if (error.constraint === "price_positive_check") {
                    return {
                        success: false,
                        message: `Daily rent price must be greater than 0`,
                        statusCode: 400
                    }
                }
            }

            return {
                success: false,
                statusCode: 500,
                message: error.message || "Something went wrong"
            }
        }
    },

    //all vehicle
    async getAllVehicles() {

        try {
            const result = await pool.query(`SELECT * FROM Vehicles`)
            // console.log("REsulst", result)

            if (result.rows.length === 0) {
                return {
                    success: true,
                    message: "No vehicles found",
                    data: []
                }
            }

            return {
                "success": true,
                "message": "Vehicles retrieved successfully",
                "data": result.rows,
            }
        } catch (error: any) {
            return {
                success: false,
                statusCode: 400,
                message: error.message || "Something went wrong"
            }
        }
    },

    //get vehicle by id
    async getVehicleById(vehicleId: number) {

        try {
            const result = await pool.query(
                `
            SELECT * FROM Vehicles WHERE id=$1
            `, [vehicleId]
            )
            // console.log(result.rows[0].id)

            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: `No vehicles found with id :${vehicleId} `,
                    data: []
                }
            }
            return {
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0],
            }


        } catch (error: any) {
            return {
                success: false,
                statusCode: 400,
                message: error.message || "Something went wrong"
            }
        }
    },

    //update vehicle
    async updateVehicle(vehicleId: number, payload: any) {

        // const existingVehicle = this.getVehicleById(vehicleId)

        const existingVehicle = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [vehicleId])

        if (existingVehicle.rowCount === 0) {
            return {
                success: false,
                message: "Vehicle not found",
                statusCode: 404
            }
        }

        //merge for optional fields
        const updatedVehicle = {
            ...existingVehicle.rows[0],
            ...payload
        }

        console.log("Updated Vehicle ", updatedVehicle)

        const {
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status
        } = payload;

        console.log("name", vehicle_name)


        const result = await pool.query(
            `UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5  WHERE id=$6 RETURNING *`,
            [updatedVehicle.vehicle_name,
            updatedVehicle.type,
            updatedVehicle.registration_number,
            updatedVehicle.daily_rent_price,
            updatedVehicle.availability_status,
                vehicleId]
        )

        console.log("RESULT ", result)
        return {
            success: true,
            message: "upated!!!",
            data: result.rows[0]
        }
    },

    //delete vehicle by id
    async deleteVehicle(vehicleId: number) {
        const result = await pool.query(
            `DELETE FROM Vehicles WHERE id=$1`, [vehicleId]
        )
        console.log("RESULT--> ", result)

        if (result.rowCount === 0) {
            return {
                success: false,
                message: "Vehicle not found",
                statusCode: 404
            }
        }

        return {
            success: true,
            message: "Vehicle deleted successfully",
        }
    }
}
