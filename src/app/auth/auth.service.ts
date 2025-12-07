import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { validateSignup } from "../middleware/validateSignup";
import { config } from "../config";
import jwt from "jsonwebtoken"


export const AuthService = {
    async test() {
        return {
            success: "true",
            message: "hello, testing 1,2,3....",
            statusCode: 200
        }
    },

    //signup
    async userSignup(payload: any) {

        try {
            // console.log("Payload from user signup ", payload);

            //calling the validate signup to return msgs
            const validate = validateSignup(payload);
            if (!validate.success === true) {
                return validate;
            }

            else {

                const { name, email, password, phone, role } = payload;

                //bcrypt the password
                const hashedPsw = await bcrypt.hash(password, 10)

                //insert into user table. 
                const result = await pool.query(
                    `
                    INSERT INTO users (name ,email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
                    `, [name, email, hashedPsw, phone, role]
                )


                console.log("Result", result.rows[0])

                const fromDB: any = result.rows[0];

                //getting everything without password. 
                console.log(fromDB.name)

                //discarding the password
                const { password: _password, ...withoutPsw } = fromDB;

                // console.log("data ", withourPwd)
                // console.log("data ", _password)

                return {
                    success: true,
                    message: "User registered successfully",
                    data: withoutPsw
                }
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

            return {
                success: false,
                statusCode: 500,
                message: error.message || "Something went wrong"
            }
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
