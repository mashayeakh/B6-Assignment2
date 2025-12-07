import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { validateSignup } from "../middleware/validateSignup";
import { config } from "../config";
import jwt from "jsonwebtoken"


export const AuthService = {

    //signup
    async userSignup(payload: any) {
        try {
            // Validate payload
            const validate = validateSignup(payload);
            if (!validate.success) return validate;

            const { name, email, password, phone, role } = payload;

            // Pre-check if email exists
            const existingUser = await pool.query(`SELECT id FROM users WHERE email=$1`, [email]);
            if (existingUser.rowCount! > 0) {
                return {
                    success: false,
                    message: "Email already exists",
                    statusCode: 400
                };
            }

            // Hash the password
            const hashedPsw = await bcrypt.hash(password, 10);

            // Insert user
            const result = await pool.query(
                `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [name, email, hashedPsw, phone, role]
            );

            const fromDB = result.rows[0];
            const { password: _password, ...withoutPsw } = fromDB;

            return {
                success: true,
                message: "User registered successfully",
                data: withoutPsw
            };

        } catch (error: any) {
            console.error("Error during signup:", error);
            return {
                success: false,
                statusCode: 500,
                message: error.message || "Something went wrong"
            };
        }
    },


    //signin
    async userSignin(email: string, password: string) {
        //check the email
        const foundEmail = await pool.query(
            `SELECT * FROM users WHERE email=$1`, [email]
        )

        console.log("foundEmail", foundEmail.rows[0])

        //if not found
        if (foundEmail.rows.length === 0) {
            return {
                success: false,
                message: "Email not found",
                statusCode: 404,
            }
        }
        else {
            const user = foundEmail.rows[0];
            // console.log(user.password)

            // console.log(password)

            //comparing input password with bcrypt password
            const isMatched = await bcrypt.compare(password, user.password);

            console.log("Is matched ", isMatched)//true, 
            if (!isMatched) {
                return {
                    success: false,
                    message: "password not matched",
                    statusCode: 404,
                };
            } else {
                //if isMatched is true, 
                //we will be using jwt here. 
                const secret = config.jwtSecret as string;
                // console.log("Secret ", secret);

                //create the token
                const token = jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }, secret, {
                    //expried time
                    expiresIn: "7d"
                }
                );

                const { password: _password, ...withoutPsw } = user;


                return {
                    success: true,
                    message: "Login successful",
                    token: token,
                    user: withoutPsw,
                }
            }

        }

    }
}
