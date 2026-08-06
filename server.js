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

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
// Database Connection
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Connect Database
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:");
        console.error(err);
        return;
    }

    console.log("✅ Connected to MySQL");
});
db.query(`
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
`, (err)=>{
    if(err) console.log(err);
    else console.log("Users table ready");
});
db.query(`
CREATE TABLE IF NOT EXISTS projects (
    id INT NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(255),
    title VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vision VARCHAR(255),
    thoughts TEXT,
    project_type VARCHAR(50),
    github VARCHAR(255),
    reference_link VARCHAR(255),
    cover_image VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
`, (err)=>{
    if(err) console.log(err);
    else console.log("Projects table ready");
});
// Signup Route
app.post("/signup", async (req, res) => {

    const { fullname, email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {
    console.error("Signup SELECT Error:", err);

    return res.status(500).json({
        message: err.message
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