//we will configure dotenv and port and connection_string here. 

import dotenv from 'dotenv';
import path from "path";

//configuring exact path of .env
dotenv.config({
    path: path.join(
        process.cwd(), ".env"
    )
});

//configuring port and connection_string
export const config = {
    connection_string: process.env.CONNECTION_STRING,
    port: process.env.port,
    jwtSecret:process.env.JWT_SECRET
}

// console.log({ "config.port": config.port })

