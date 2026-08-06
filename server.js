const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
require("dotenv").config();
const path = require("path");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const bcrypt = require("bcrypt");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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
//project to open from dashboard
app.get("/project/:id", (req, res) => {

    const id = req.params.id;

    db.query(

        "SELECT * FROM projects WHERE id = ?",

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Project not found"
                });

            }

            res.json(result[0]);

        }

    );

});
//update route
app.put("/project/:id", (req, res) => {

    const id = req.params.id;

    const {
        title,
        vision,
        thoughts,
        github,
        reference_link
    } = req.body;

    db.query(

        `UPDATE projects
        SET
        title=?,
        vision=?,
        thoughts=?,
        github=?,
        reference_link=?,
        updated_at=NOW()
        WHERE id=?`,

        [
            title,
            vision,
            thoughts,
            github,
            reference_link,
            id
        ],

        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:"Update Failed"
                });

            }

            res.json({
                message:"Project Updated!"
            });

        }

    );

});
//delete route 
app.delete("/project/:id", (req, res) => {

    const id = req.params.id;

    db.query(

        "DELETE FROM projects WHERE id = ?",

        [id],

        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Delete Failed"
                });

            }

            res.json({
                message: "Project Deleted Successfully!"
            });

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
//ai route
app.post("/ai", async (req, res) => {

    try {

        const {

    title,

    vision,

    thoughts,

    status,

    project_type,

    prompt

} = req.body;

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content:
                        "You are Muse AI, a helpful software development assistant. Help users improve, design and build their software projects. Give practical coding advice."
                },

                {
                    role: "user",
                    content: `
Project Title:
${title}

Vision:
${vision}

Thoughts:
${thoughts}

Status:
${status}

Project Type:
${project_type}

User Question:
${prompt}
`
                }

            ]

        });

        res.json({

            reply: completion.choices[0].message.content

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            reply: "Something went wrong."

        });

    }

});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/create-project", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "create-project.html"));
});

app.get("/project", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "project.html"));
});
// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});