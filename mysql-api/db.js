const mysql = require("mysql")
const config = require("./config/config.js")

const con = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB
})

con.connect(err => {
    if (err) {
        console.error("There was an error connecting to the database.")
        throw err
    }
    console.log("Connection established with ID " + con.threadId)
})

module.exports = con