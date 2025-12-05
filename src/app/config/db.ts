// here we will initiate our tables and handle err if connection_str is not found/loaded. 
import { config } from './index';
import { Pool } from "pg";


//if connection_str is not loaded 
if (!config.connection_string) {
    throw new Error(`CONNECTION_STRING environment variable is not loaded.. `);
}


//creating pool and setting our connection_string
export const pool = new Pool({
    connectionString: config.connection_string
})


//test the connection
pool.on('connect', () => {
    console.log(`Connected to pg db`)
})

//if error comes up
pool.on('error', (err) => {
    console.log(`PostgreSQL error ${err}`)
})


//Initiate DB

const userTable = `
        CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL,

        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT email_lowercase_check CHECK (email = LOWER(email)),

        CHECK (LENGTH(password)>=6)
    )`



const vehicleTable = `
    CREATE TABLE IF NOT EXISTS Vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10, 2) NOT NULL,
    availability_status VARCHAR(20) NOT NULL,


    CONSTRAINT price_positive_check CHECK(daily_rent_price > 0),
    CONSTRAINT vehicle_type_check CHECK(type IN('car', 'bike', 'van', 'SUV')),
    CONSTRAINT status_check CHECK (availability_status IN ('available','booked'))
)
    `;


export const initiateDB = async () => {

    //user table
    await pool.query(
        userTable,
    );

    //vehicle table
    await pool.query(
        vehicleTable,
    )

    console.log("Database initialized");
}