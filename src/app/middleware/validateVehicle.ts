export const validateVehicle = (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    //custom msg for each one of them.

    if (!vehicle_name || vehicle_name.trim().length === 0) {
        return { success: false, message: "Vehicle name is required", statusCode: 400 };
    }

    const validTypes = ["car", "bike", "van", "SUV"];
    if (!type || !validTypes.includes(type)) {
        return { success: false, message: `Type must be one of: ${validTypes.join(", ")}`, statusCode: 400 };
    }

    if (!registration_number || registration_number.trim().length === 0) {
        return { success: false, message: "Registration number is required", statusCode: 400 };
    }

    if (!daily_rent_price || daily_rent_price <= 0) {
        return { success: false, message: "Daily rent price must be greater than 0", statusCode: 400 };
    }

    const validStatus = ["available", "booked"];
    if (!availability_status || !validStatus.includes(availability_status)) {
        return { success: false, message: `Availability status must be 'available' or 'booked'`, statusCode: 400 };
    }

    return { success: true };
};
