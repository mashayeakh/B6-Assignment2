import { Request, Response } from "express";
import { pool } from "../../config/db";
import { AuthMiddleware } from "../../middleware/auth";

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
    // async getAllBookings() {
    //     //depending on the role users can see two types of json. adming and customer

    //     try {
    //         const bookingResult = await pool.query(`SELECT * FROM bookings`)
    //         // console.log("REsulst", result)

    //         if (bookingResult.rows.length === 0) {
    //             return {
    //                 success: true,
    //                 message: "No bookings found",
    //                 data: []
    //             }
    //         }

    //         //customer query
    //         const cutomerQ = await pool.query(`SELECT 
    //                         u.name AS name,
    //                         u.email AS email
    //                         FROM bookings b
    //                         JOIN users u ON b.customer_id = u.id;
    //                     `);

    //         console.log("Custo------ ", cutomerQ)
    //         console.log("Custo------ ", cutomerQ.rowCount)

    //         //vehicle query
    //         const vehicleQ = await pool.query(`SELECT
    //                         v.vehicle_name AS vehicle_name,
    //                         v.registration_number AS registration_number
    //                         FROM vehicles v 
    //                         JOIN bookings b ON b.vehicle_id = v.id

    //             `)

    //         console.log("VehicleQ------ ", vehicleQ)
    //         console.log("VehicleQ------ ", vehicleQ.rowCount)

    //         //lets grab the role base

    //         const admin = await pool.query(`SELECT * FROM users where role=$1`, ["admin"])

    //         const customer = await pool.query(`SELECT * FROM users where role=$1`, ["customer"])

    //         //admin view
    //         const value = {
    //             ...bookingResult.rows,
    //             ...cutomerQ
    //         }

    //         console.log("Admin view ", value)

    //         return {
    //             "success": true,
    //             "message": "Bookings retrieved successfully",
    //             "data": value,
    //         }





    //         return {
    //             "success": true,
    //             "message": "Bookings retrieved successfully",
    //             "data": bookingResult.rows,
    //         }
    //     } catch (error: any) {
    //         return {
    //             success: false,
    //             statusCode: 400,
    //             message: error.message || "Something went wrong"
    //         }
    //     }
    // },

    async getAllBookings(req: Request, res: Response) {
        try {
            // Check user role from JWT
            const userRole = req.user?.role;
            const userId = req.user?.id;

            if (!userRole || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            if (userRole === "customer") {
                // Customer view: only their bookings
                const bookingsResult = await pool.query(
                    `SELECT 
                    b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
                    v.vehicle_name, v.registration_number, v.type AS vehicle_type
                 FROM bookings b
                 JOIN vehicles v ON b.vehicle_id = v.id
                 WHERE b.customer_id = $1`,
                    [userId]
                );

                const data = bookingsResult.rows.map(row => ({
                    id: row.id,
                    vehicle_id: row.vehicle_id,
                    rent_start_date: row.rent_start_date,
                    rent_end_date: row.rent_end_date,
                    total_price: row.total_price,
                    status: row.status,
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number,
                        type: row.vehicle_type
                    }
                }));

                return res.status(200).json({
                    success: true,
                    message: "Your bookings retrieved successfully",
                    data
                });
            } else if (userRole === "admin") {
                // Admin view: all bookings
                const bookingsResult = await pool.query(
                    `SELECT 
                    b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
                    u.name AS customer_name, u.email AS customer_email, u.role AS customer_role,
                    v.vehicle_name, v.registration_number, v.type AS vehicle_type
                 FROM bookings b
                 JOIN users u ON b.customer_id = u.id
                 JOIN vehicles v ON b.vehicle_id = v.id`
                );

                const data = bookingsResult.rows.map(row => ({
                    id: row.id,
                    customer_id: row.customer_id,
                    vehicle_id: row.vehicle_id,
                    rent_start_date: row.rent_start_date,
                    rent_end_date: row.rent_end_date,
                    total_price: row.total_price,
                    status: row.status,
                    customer: {
                        name: row.customer_name,
                        email: row.customer_email,
                        role: row.customer_role
                    },
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number,
                        type: row.vehicle_type
                    }
                }));

                return res.status(200).json({
                    success: true,
                    message: "All bookings retrieved successfully",
                    data
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: "Role not authorized"
                });
            }

        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            return {
                success: false,
                message: error.message || "Something went wrong"
            };
        }
    },

    async updateBooking(bookingId: number, user: any, payload: any) {

        try {
            const role = user?.role?.toLowerCase();
            const currDate = new Date();

            // Get booking details
            const bookingResult = await pool.query(
                `SELECT * FROM bookings WHERE id=$1`,
                [bookingId]
            );

            if (bookingResult.rowCount === 0) {
                return { success: false, message: "Booking not found" };
            }

            const booking = bookingResult.rows[0];
            const startDate = new Date(booking.rent_start_date);
            const endDate = new Date(booking.rent_end_date);

            // Days difference for reference
            const diffDays = Math.floor((currDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            console.log("Days difference:", diffDays);

            // CUSTOMER: Cancel booking (before start date)
            if (role === "customer") {
                if (currDate < startDate) {
                    const response = await pool.query(
                        `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
                        ['cancelled', bookingId]
                    );
                    return {
                        success: true,
                        message: "Booking cancelled successfully",
                        data: response.rows[0]
                    };
                } else {
                    return {
                        success: false,
                        message: "Cannot cancel booking after start date"
                    };
                }
            }

            // ADMIN: Mark as returned (only after end date)
            if (role === "admin") {
                if (currDate >= endDate) {
                    const response = await pool.query(
                        `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
                        ['returned', bookingId]
                    );

                    // Update vehicle availability to "available"
                    await pool.query(
                        `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
                        ['available', booking.vehicle_id]
                    );

                    return {
                        success: true,
                        message: "Booking marked as returned by admin",
                        data: response.rows[0]
                    };
                } else {
                    return {
                        success: false,
                        message: "Cannot mark as returned before rental end date"
                    };
                }
            }

            // SYSTEM: Auto-mark as returned if rental period ends
            //status cant be returned, currDate must be greater or equal to endDate
            if (currDate >= endDate && booking.status !== "returned") {
                const response = await pool.query(
                    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
                    ['returned', bookingId]
                );

                await pool.query(
                    `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
                    ['available', booking.vehicle_id]
                );

                return {
                    success: true,
                    message: "Booking auto-marked as returned",
                    data: response.rows[0]
                };
            }

        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            return {
                success: false,
                message: error.message || "Something went wrong"
            };
        }
    }

}
