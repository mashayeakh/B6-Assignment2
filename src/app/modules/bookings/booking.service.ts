import { Request, Response } from "express";
import { pool } from "../../config/db";
import { AuthMiddleware } from "../../middleware/auth";

export const BookingService = {

    //create booking
    async createBooking(payload: any) {
        try {
            const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

            // Calculate number of days
            const startDate = new Date(rent_start_date);
            const endDate = new Date(rent_end_date);
            const diffTime = endDate.getTime() - startDate.getTime();
            const numOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (numOfDays <= 0) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "End date must be after start date"
                };
            }

            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];

            // Retrieve vehicle info
            const vehicleResult = await pool.query(
                `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
                [vehicle_id]
            );
            if (vehicleResult.rowCount === 0) {
                return { success: false, statusCode: 404, message: "Vehicle id does not exist" };
            }

            // Check customer id
            const customerCheck = await pool.query(`SELECT id FROM users WHERE id = $1`, [customer_id]);
            if (customerCheck.rowCount === 0) {
                return { success: false, statusCode: 404, message: "Customer id does not exist" };
            }

            const vehicleRow = vehicleResult.rows[0];
            const dailyRentPrice = Number(vehicleRow.daily_rent_price);

            const total_price = dailyRentPrice * numOfDays;

            const bookingQuery = await pool.query(
                `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
             VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
                [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
            );

            const booking = bookingQuery.rows[0];

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
                statusCode: 201,
                message: "Booking created successfully",
                data: responseData
            };

        } catch (error: any) {
            return {
                success: false,
                statusCode: 500,
                message: error.message || "Something went wrong"
            };
        }
    },




    //get all booking
    async getAllBookings(req: Request, res: Response) {
        try {
            const userRole = req.user?.role;
            const userId = req.user?.id;

            if (!userRole || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            // customer view
            if (userRole === "customer") {
                const bookingsResult = await pool.query(
                    `SELECT 
                    b.id, 
                    b.vehicle_id, 
                    TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                    TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                    b.total_price, 
                    b.status,
                    v.vehicle_name, 
                    v.registration_number, 
                    v.type AS vehicle_type
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
            }

            // Admin View
            if (userRole === "admin") {
                const bookingsResult = await pool.query(
                    `SELECT 
                    b.id, 
                    b.customer_id, 
                    b.vehicle_id,
                    TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                    TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                    b.total_price, 
                    b.status,
                    u.name AS customer_name, 
                    u.email AS customer_email,
                    v.vehicle_name, 
                    v.registration_number,
                    v.type AS vehicle_type
                FROM bookings b
                JOIN users u ON b.customer_id = u.id
                JOIN vehicles v ON b.vehicle_id = v.id
                ORDER BY b.id ASC`
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
                        email: row.customer_email
                    },
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number
                    }
                }));

                return res.status(200).json({
                    success: true,
                    message: "Bookings retrieved successfully",
                    data
                });
            }

            return res.status(403).json({
                success: false,
                message: "Role not authorized"
            });

        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong"
            });
        }
    }, 


    //update booking
    async updateBooking(bookingId: number, user: any, payload: any) {
        try {
            const role = user?.role?.toLowerCase();
            const newStatus = payload?.status;
            const userId = user?.id;

            const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
            if (!bookingRes.rows.length) {
                return { success: false, statusCode: 404, message: "Booking not found" };
            }

            const booking = bookingRes.rows[0];

            const today = new Date();
            // Normalize to start of day
            today.setHours(0, 0, 0, 0); 

            const startDate = new Date(booking.rent_start_date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(booking.rent_end_date);
            endDate.setHours(0, 0, 0, 0);

            // System auto-mark as returned when period ends (for all roles except customer cancellation)
            if (!(role === "customer" && newStatus === "cancelled")) {
                if (today > endDate && booking.status !== "returned") {
                    const updatedBooking = await pool.query(
                        `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
                        [bookingId]
                    );
                    await pool.query(
                        `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
                        [booking.vehicle_id]
                    );

                    return {
                        success: true,
                        statusCode: 200,
                        message: "Booking auto-marked as returned. Vehicle is now available",
                        data: {
                            ...updatedBooking.rows[0],
                            vehicle: { availability_status: "available" }
                        }
                    };
                }
            }

            // Customer logic
            if (role === "customer") {
                if (booking.customer_id !== userId) {
                    return { 
                        success: false, 
                        statusCode: 403, 
                        message: "You are not authorized to update this booking" 
                    };
                }

                if (newStatus !== "cancelled") {
                    return { 
                        success: false, 
                        statusCode: 400, 
                        message: "Invalid status update for customer" 
                    };
                }

                // Customer can only cancel BEFORE the start date
                if (today >= startDate) {
                    return { 
                        success: false, 
                        statusCode: 400, 
                        message: "Cannot cancel booking on or after start date" 
                    };
                }

                const updatedBooking = await pool.query(
                    `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
                    [bookingId]
                );

                return {
                    success: true,
                    statusCode: 200,
                    message: "Booking cancelled successfully",
                    data: updatedBooking.rows[0]
                };
            }

            // Admin logic
            if (role === "admin") {
                if (newStatus !== "returned") {
                    return { 
                        success: false, 
                        statusCode: 400, 
                        message: "Invalid status update for admin" 
                    };
                }

                // Admin can only mark as returned ON or AFTER the end date
                if (today < endDate) {
                    return { 
                        success: false, 
                        statusCode: 400, 
                        message: "Cannot mark as returned before rental end date" 
                    };
                }

                const updatedBooking = await pool.query(
                    `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
                    [bookingId]
                );
                await pool.query(
                    `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
                    [booking.vehicle_id]
                );

                return {
                    success: true,
                    statusCode: 200,
                    message: "Booking marked as returned. Vehicle is now available",
                    data: {
                        ...updatedBooking.rows[0],
                        vehicle: { availability_status: "available" }
                    }
                }
            }

            return { 
                success: false, 
                statusCode: 403, 
                message: "You are not allowed to perform this action" 
            };

        } catch (error: any) {
            return { 
                success: false, 
                statusCode: 500, message: error.message || "Something went wrong" 
            };
        }
    }

}
