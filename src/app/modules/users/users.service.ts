import { pool } from "../../config/db";

export const UserService = {
    async test() {
        return {
            success: "true",
            message: "hello, testing 1,2,3....",
            statusCode: 200
        }
    },



    //get all user - admin access
    async getAllUser() {
        const result = await pool.query(
            `SELECT * FROM users`
        )


        const data = result.rows;
        const finalVal = data.map((val) => {
            const { password, ...withoutPsw } = val
            return withoutPsw;
        })

        // console.log("F", final)

        return {
            success: true,
            message: "Users retrieved successfully",
            data: finalVal,
        }
    },


    //update user
    async updateUser(id: number, user: any, payload: any) {

        const { name, email, phone, role } = payload;

        const loggedInUser = user?.role?.toLowerCase();
        const loggedInUserId = user?.id;

        if (loggedInUser === "customer" && loggedInUserId !== id) {
            return {
                success: false,
                message: "Customers can only update their own profile"
            };
        }

        console.log("calling from update user ----", payload)
        const response = await pool.query(
            `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]
        );

        // console.log("UUAWE ", response.rows[0].name)

        const result = response?.rows;
        const finalVal = result.map((u: any) => {
            const { password, ...withoutResult } = u;
            return withoutResult;
        })


        return {
            success: true,
            message: "User updated successfully",
            data: finalVal,
        };
    },

    //delete user using id - admin access
    async deleteUser(id: number) {
        const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
        return {
            success: true,
            message: "User deleted successfully"
        }
    }
}


