import { pool } from "../../config/db";

export const BookingService = {
    async test() {
        return {
            success: "true",
            message: "hello, from booking service",
            statusCode: 200
        }
    },

    //create booking
    async createBooking(payload: any) {

        try {
            const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

            console.log("Payload data ", payload);

            // Calculate number of days
            const startDate = new Date(rent_start_date);
            const endDate = new Date(rent_end_date);

            const diffTime = endDate.getTime() - startDate.getTime();
            const numOfDays = diffTime / (1000 * 60 * 60 * 24);

            if (numOfDays <= 0) {
                throw new Error("End date must be after start date");
            }

            console.log("Days:", numOfDays);

            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];


            // Retrieve vehicle info
            const result = await pool.query(
                `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
                [vehicle_id]
            );

            if (result.rowCount === 0) {
                return {
                    success: false,
                    status: 404,
                    message: "Vehicle id does not exist"
                }
            }

            //custom check for customer id
            const customerIdCheck = await pool.query(
                `SELECT id FROM users WHERE id = $1`,
                [customer_id]
            );

            if (customerIdCheck.rowCount === 0) {
                return {
                    success: false,
                    status: 404,
                    message: "Customer id does not exist"
                }
            }

            const vehicleRow = result.rows[0];
            const dailyRentPrice = parseFloat(vehicleRow.daily_rent_price);

            console.log("Daily Rent Price:", dailyRentPrice);

            // Calculate total price
            const total_price = dailyRentPrice * numOfDays;
            console.log("Total Price:", total_price);

            // Create booking
            const bookingQuery = await pool.query(
                `
        INSERT INTO bookings(
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status
        )
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *
        `,
                [
                    customer_id,
                    vehicle_id,
                    rent_start_date,
                    rent_end_date,
                    total_price,
                ]
            );

            console.log("Que", bookingQuery)


            const booking = bookingQuery.rows[0];

            // Build final response shape
            const responseData = {
                id: booking.id,
                customer_id: booking.customer_id,
                vehicle_id: booking.vehicle_id,
                rent_start_date: formattedStartDate,
                rent_end_date: formattedEndDate,
                total_price: booking.total_price,
                status: booking.status,
                vehicle: {
                    vehicle_name: vehicleRow.vehicle_name,
                    daily_rent_price: dailyRentPrice
                }
            };

            return {
                success: true,
                message: "Booking created successfully",
                data: responseData
            };
        } catch (error: any) {
            return {
                success: false,
                statusCode: 500,
                message: error.message || "Something went wrong"
            }
        }

    },

    //get all booking
    async getAllBookings() {
        //depending on the role users can see two types of json. adming and customer

        try {
            const result = await pool.query(`SELECT * FROM bookings`)
            // console.log("REsulst", result)

            if (result.rows.length === 0) {
                return {
                    success: true,
                    message: "No bookings found",
                    data: []
                }
            }

            return {
                "success": true,
                "message": "Bookings retrieved successfully",
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



}
