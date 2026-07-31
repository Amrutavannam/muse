const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "muse"
});

// Connect Database
db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("Connected to MySQL");
});

// Signup Route
app.post("/signup", (req, res) => {

    const { fullname, email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            db.query(
                "INSERT INTO users(fullname,email,password) VALUES(?,?,?)",
                [fullname, email, password],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Signup Failed"
                        });
                    }

                    res.json({
                        message: "Signup Successful!"
                    });

                }
            );

        }
    );

});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});