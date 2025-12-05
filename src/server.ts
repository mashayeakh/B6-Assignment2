import app from "./app";
import { config } from "./app/config";
import { initiateDB } from "./app/config/db";

const port = config.port;

//setting db here

initiateDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Assignment 2 running on ${port}`)
        });
    }).catch(error => {
        console.log(`Assignment 2 failed to run ${error}`)
    })
