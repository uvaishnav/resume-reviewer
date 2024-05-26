const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 9000;
const upload = multer({ dest: 'uploads/' });
const secretKey = 'uvaishnav';

app.use(cors());
app.use(express.json())

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// USER REGESTRATION

app.post("/api/register", async (request, response) => {
    const { username, password, name, role } = request.body;

    // Check for existing username using a parameterized query
    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;

    try {
        const user = await new Promise((resolve, reject) => {
            db.get(checkUserQuery, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (user) {
            response.status(400).send("Username taken. Try another one");
            return;
        }

        if (password.length < 6) {
            response.status(400).send("Password is too short. Min 8 characters required");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Using a more common salt rounds value

        const addUserQuery = `INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)`;

        const userId = await new Promise((resolve, reject) => {
            db.run(addUserQuery, [username, hashedPassword, name, role], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        if (role === "student") {
            const { email, cgpa, curr_year, branch } = request.body;
            const addStudentQuery = `INSERT INTO student (user_id, email, cgpa, curr_year, branch) VALUES (?, ?, ?, ?, ?)`;
            await new Promise((resolve, reject) => {
                db.run(addStudentQuery, [userId, email, cgpa, curr_year, branch], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
            console.log("Student details added");
        } else if (role === "alumni") {
            const { email, linkedin, curr_role, suggest_roles } = request.body;
            const addAlumniQuery = `INSERT INTO alumni (user_id, email, linkedin, curr_role, suggest_roles) VALUES (?, ?, ?, ?, ?)`;
            await new Promise((resolve, reject) => {
                db.run(addAlumniQuery, [userId, email, linkedin, curr_role, suggest_roles], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
            console.log("Alumni added");
        }

        response.status(201).send("User created successfully");
    } catch (error) {
        console.error(`Failed to add user: ${error.message}`);
        response.status(500).send("Internal server error");
    }
});

// USER LOGIN

app.post("/api/login", async (request, response) => {
    const { username, password } = request.body;

    // Validate the request body
    if (!username || !password) {
        response.status(400).send("Username and password are required");
        return;
    }

    try {
        // Check for user existence using a parameterized query
        const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
        const user = await new Promise((resolve, reject) => {
            db.get(checkUserQuery, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (user === undefined) {
            response.status(400).send("Invalid user");
            return;
        }

        const dbPassword = user.password;
        const isPasswordMatched = await bcrypt.compare(password, dbPassword);

        if (!isPasswordMatched) {
            response.status(400).send("Invalid password");
            return;
        }

        const payload = { id: user.id, role: user.role };
        const jwtToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        response.send({ jwtToken, role: user.role });

    } catch (error) {
        console.error(`Login failed: ${error.message}`);
        response.status(500).send("Internal server error");
    }
});

