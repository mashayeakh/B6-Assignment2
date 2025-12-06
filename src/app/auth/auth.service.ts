import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { validateSignup } from "../middleware/validateSignup";

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
                const { password: _password, ...withoutPwd } = fromDB;

                // console.log("data ", withourPwd)
                // console.log("data ", _password)

                return {
                    success: true,
                    message: "User created successfully",
                    data: withoutPwd
                }
            }

            //bcrypt the password

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

    }









    //signin

}
