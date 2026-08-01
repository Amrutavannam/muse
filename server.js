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
//project
app.post("/projects", (req, res) => {

    const {
        user_email,
        title,
        vision,
        thoughts,
        status,
        project_type,
        github,
        reference_link
    } = req.body;

    db.query(
        `INSERT INTO projects
        (user_email,title,vision,thoughts,status,project_type,github,reference_link)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
            user_email,
            title,
            vision,
            thoughts,
            status,
            project_type,
            github,
            reference_link
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Couldn't save project"
                });
            }

            res.json({
                message: "Project saved successfully!"
            });

        }
    );

});
//projects
app.get("/projects/:email",(req,res)=>{

    const email=req.params.email;

    db.query(

        "SELECT * FROM projects WHERE user_email=? ORDER BY created_at DESC",

        [email],

        (err,result)=>{

            if(err){

                return res.status(500).json({
                    message:"Database Error"
                });

            }

            res.json(result);

        }

    );

});
//profile route 
app.post("/profile", (req, res) => {

    const { email } = req.body;

    db.query(
        "SELECT fullname,email FROM users WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "User Not Found"
                });

            }

            res.json(result[0]);

        }
    );

});
//create project route 
app.post("/create-project",(req,res)=>{

const {user_email,title,description,status}=req.body;

db.query(

"INSERT INTO projects(user_email,title,description,status) VALUES(?,?,?,?)",

[user_email,title,description,status],

(err)=>{

if(err){

return res.status(500).json({

message:"Failed"

});

}

res.json({

message:"Project Created Successfully"

});

}

);

});
// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});