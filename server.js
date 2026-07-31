const bcrypt = require("bcrypt");
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
app.post("/signup", async (req, res) => {

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
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.query(
                "INSERT INTO users(fullname,email,password) VALUES(?,?,?)",
                [fullname, email, hashedPassword],
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

//login route
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(400).json({
                    message: "Email not found"
                });
            }

            const user = result[0];

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Incorrect password"
                });
            }

            res.json({
                message: "Login Successful!"
            });

        }
    );

});
// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});