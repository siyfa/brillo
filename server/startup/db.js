const pg = require("pg");
const config = require("config");

const pool = new pg.Pool({
    user: config.get("development.user"),
    host: config.get("development.host"),
    database: config.get("development.database"),
    password: config.get("development.password"),
    port: config.get("development.port")
});

pool
    .query('SELECT NOW()')
    .then((res) => {
        console.log("Server is connected to postgresql database.... Time: " + new Date().toLocaleTimeString()
    )})
    .catch((err) => {
        console.log("Database connection error: " + err + ". Time: " + new Date().toLocaleTimeString()
    )})

module.exports = pool;