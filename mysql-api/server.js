const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db.js")
const fs = require("fs")

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the MySQL phone number database API." });
});

app.get("/:facility", (req, res) => {
    const facility = req.params.facility
    const escaped = "`" + facility + "`"
    const sql = "SELECT * FROM " + escaped
    db.query(sql, (err, response) => {
        if (err) {
            res.status(500).send({message: "Failed to access table " + facility + "."})
        }
        res.send(response)
    })
})

app.put("/:facility", (req, res) => {
    const facility = req.params.facility
    const escaped = "`" + facility + "`"
    let sql = "CREATE TABLE IF NOT EXISTS " + escaped + " (name VARCHAR(30), phone VARCHAR(16))"
    db.query(sql, (err, response) => {
        if (err) {
            res.status(500).send({message: "Failed to create table " + facility + "."})
        }
        sql = "TRUNCATE TABLE " + escaped
        db.query(sql, (err, response) => {
            if (err) {
                res.status(500).send({message: "Failed to clear table " + facility + "."})
            }
            let data = req.body
            data = data.map(data => [data.name, data.phone])
            sql = "INSERT INTO " + escaped + " (name, phone) VALUES ?"
            db.query(sql, [data], (err, response) => {
                if (err) {
                    console.error(err)
                    res.status(500).send({message: "Failed to edit table " + facility + "."})
                }
                res.end()
            })
        })
    })
})

app.post('/documents/sample', function (req, res) {
    fs.readFile('sampleHWR.txt', 'utf-8', (err, data) => { 
        if (err) throw err;
        let soap = `<soap:Envelope 
        xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
        xmlns:wsa="http://www.w3.org/2005/08/addressing" 
        xmlns:csd="urn:ihe:iti:csd:2013"> 
        <soap:Header>
        <wsa:Action soap:mustUnderstand="1" >urn:ihe:iti:csd:2013:GetDirectoryModificationsResponse</wsa:Action>
        <wsa:MessageID>urn:uuid:{random:uuid()}</wsa:MessageID>
        <wsa:To soap:mustUnderstand="1">http://www.w3.org/2005/08/addressing/anonymous</wsa:To> 
        </soap:Header>
        <soap:Body>
        <csd:getModificationsResponse>
            ${data}
        </csd:getModificationsResponse>
        </soap:Body>
        </soap:Envelope>`
        res.type('application/soap+xml')
        res.status(200).send(soap)
    }) 
})

// set port, listen for requests
app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});