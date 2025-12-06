export const validateSignup = (payload: any) => {
    const { name, email, password, phone, role } = payload;

    //custom msg for each one of them.

    //name
    if (!name || name.trim().length === 0) {
        return {
            success: false,
            message: "Name is required",
            statusCode: 400
        }
    }

    //email
    if (!email || name.trim().length === 0) {
        return {
            success: false,
            message: "Email is required",
            statusCode: 400
        }
    }

    //email lowercase
    if (email !== email.toLowerCase()) {
        return {
            success: false,
            message: "Email must be lowercase",
            statusCode: 400
        }
    }

    //password check before hasing
    if (!password || password.length < 6) {
        return {
            success: false,
            message: "Password must be at least 6 characters",
            statusCode: 400
        }
    }

    //phone 
    if (!phone || phone.trim().length < 11) {
        return {
            success: false,
            message: "Phone number is invalid",
            statusCode: 400
        }
    }

    //role
    const roleCheck: string[] = ["admin", "customer"];
    if (!roleCheck.includes(role)) {
        return {
            success: false,
            message: "Role must be either admin or customer",
            statusCode: 400
        }
    }

    //otherwise true for all
    return { success: true }

}