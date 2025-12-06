import { pool } from "../../config/db";

export const UserService = {
    async test() {
        return {
            success: "true",
            message: "hello, testing 1,2,3....",
            statusCode: 200
        }
    },

    async createDemoUser(payload: any) {
        try {
            const { name, email, password, phone, role } = payload;

            console.log({ "payload data from body ": payload })

            //insert values into user table
            const insertion = await pool.query(
                `
                INSERT INTO Users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
                `, [name, email, password, phone, role]
            )

            console.log("Respoine ", insertion)
            if (insertion.rowCount !== 1) {
                return {
                    success: false,
                    message: "Bad Request",
                    // data: insertion.rows[0],
                    statusCode: 400,
                }
            }

            return {
                success: true,
                message: "User created successfully",
                data: insertion.rows[0],
                statusCode: 201,
            }
        } catch (error: any) {

            //checking duplicate email with code 23505
            if (error.code === "23505") {
                return {
                    success: false,
                    message: "Email already exists",
                    statusCode: 400
                }
            }

            //email lowercase constraint/issue
            if (error.constraint === "email_lower_check") {
                return {
                    success: false,
                    message: "Email must be lowercase",
                    statusCode: 400
                }
            }

            //password length issue
            if (error.constraint === "users_password_check") {
                return {
                    success: false,
                    message: "Password must be at least 6 characters",
                    statusCode: 400
                }
            }

            return {
                success: false,
                statusCode: 400,
                message: error.message || "Something went wrong"
            }
        }
    },

    async getAllUser() {
        const result = await pool.query(
            `SELECT * FROM users`
        )

        return {
            success: true,
            message: "fetched everything",
            data: result.rows,
        }
    }

}

