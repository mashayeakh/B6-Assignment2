import { pool } from "../../config/db";

export const UserService = {

    //get all user - admin access
    async getAllUser() {
        try {
            const result = await pool.query(`SELECT * FROM users`);
            const data = result.rows;

            const finalVal = data.map((val) => {
                const { password, ...withoutPsw } = val;
                return withoutPsw;
            });

            return {
                success: true,
                message: "Users retrieved successfully",
                data: finalVal,
            };
        } catch (error:any) {
            return {
                success: false,
                message: "Failed to retrieve users",
                error: error.message || error,
            };
        }
    },



    //update user
    async updateUser(id: number, user: any, payload: any) {
        try {
            const { name, email, phone, role } = payload;

            const loggedInUser = user?.role?.toLowerCase();
            const loggedInUserId = user?.id;

            if (loggedInUser === "customer" && loggedInUserId !== id) {
                return {
                    success: false,
                    message: "Customers can only update their own profile",
                };
            }

            const response = await pool.query(
                `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
                [name, email, phone, role, id]
            );

            const result = response?.rows || [];

            if (result.length === 0) {
                return {
                    success: false,
                    message: "No user found with the given ID",
                };
            }

            const finalVal = result.map((u: any) => {
                const { password, ...withoutPassword } = u;
                return withoutPassword;
            });

            return {
                success: true,
                message: "User updated successfully",
                data: finalVal,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "Failed to update user",
                error: error.message || error,
            };
        }
    },


    //delete user using id - admin access
    async deleteUser(id: number) {
        try {
            const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

            if (result.rowCount === 0) {
                return {
                    success: false,
                    message: "User not found",
                    statusCode: 404,
                };
            }

            return {
                success: true,
                message: "User deleted successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                message: "Failed to delete user",
                error: error.message || error,
            };
        }
    }

}


