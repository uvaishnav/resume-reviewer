require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const secretKey = 'uvaishnav';

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
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
            response.status(400).send({message:"Invalid user"});
            return;
        }

        const dbPassword = user.password;
        const isPasswordMatched = await bcrypt.compare(password, dbPassword);

        if (!isPasswordMatched) {
            response.status(400).send({message:"Invalid password"});
            return;
        }

        const payload = { id: user.id, role: user.role };
        const jwtToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        response.send({ jwtToken, role: user.role, name:user.name,});

    } catch (error) {
        console.error(`Login failed: ${error.message}`);
        response.status(500).send({message: "Internal server error"});
    }
});

// MIDLEWARE TO AUTHENTICATE
const INVALID_TOKEN_MESSAGE = "Invalid JWT Token";

const sendUnauthorizedResponse = (response) => {
    return response.status(401).send(INVALID_TOKEN_MESSAGE);
};

const checkUserAuth = (request, response, next) => {
    try {
      const authHeader = request.headers["authorization"];
      
      if (!authHeader) {
        return sendUnauthorizedResponse(response);
      }
      
      const jwtToken = authHeader.split(" ")[1];
      
      if (!jwtToken) {
        return sendUnauthorizedResponse(response);
      }
      
      jwt.verify(jwtToken, secretKey, (error, payload) => {
        if (error) {
            console.log("Authorization failed")
          return sendUnauthorizedResponse(response);
        }

        console.log("Authorization Successful")
        
        request.userDetails = payload;
        next();
      });
    } catch (error) {
      // Centralized error handling
      console.error("Error in authentication middleware:", error);
      response.status(500).send("Internal Server Error");
    }
};

app.post('/api/upload-resume', checkUserAuth, upload.single('resume'), async (request, response) => {
    const { id, role } = request.userDetails; // Assuming you have middleware to extract user info from JWT
    const filePath = request.file.path;
    const applyingRole = request.body.applyingRole;

    console.log(id, filePath, role, applyingRole);

    // Check if the authenticated user is a student
    if (role !== 'student') {
        return response.status(403).send("Forbidden: Only students can upload resumes");
    }

    // Check if the user already has a resume
    const checkResumeQuery = `SELECT * FROM resumes WHERE user_id = ?`;
    try {
        const existingResume = await new Promise((resolve, reject) => {
            db.get(checkResumeQuery, [id], function (err, row) {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // If user has an existing resume, update it
        if (existingResume) {
            const updateResumeQuery = `UPDATE resumes SET file_path = ?, apply_role = ? WHERE user_id = ?`;
            await new Promise((resolve, reject) => {
                db.run(updateResumeQuery, [filePath, applyingRole, id], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
            response.status(200).send("Resume updated successfully");
        } else {
            // If user doesn't have an existing resume, insert a new one
            const addResumeQuery = `INSERT INTO resumes (user_id, file_path, apply_role) VALUES (?, ?, ?)`;
            await new Promise((resolve, reject) => {
                db.run(addResumeQuery, [id, filePath, applyingRole], function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
            response.status(200).send("Resume uploaded successfully");
        }
    } catch (error) {
        console.error(`Failed to upload or update resume: ${error.message}`);
        response.status(500).send("Internal server error");
    }
});

// Get Resumes Route (only for alumni)
app.get('/api/resumes', checkUserAuth, async (request, response) => {
    const { role } = request.userDetails;
  
    if (role !== 'alumni') {
      return response.status(403).json({ error: 'Access denied' });
    }
  
    const getResumesQuery = `
      SELECT r.id, u.username, r.file_path
      FROM resumes r
      JOIN users u ON r.user_id = u.id
    `;
  
    try {
      const resumes = await new Promise((resolve, reject) => {
        db.all(getResumesQuery, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      response.json(resumes);
    } catch (error) {
      console.error(`Failed to fetch resumes: ${error.message}`);
      response.status(500).json({ error: 'Failed to fetch resumes' });
    }
});

// Submit Feedback Route
app.post('/api/feedback', checkUserAuth, async (request, response) => {
    try {
        const { resumeId, skills, projects, feedback } = request.body;

        // Ensure required fields are provided
        if (!resumeId || !skills || !projects || !feedback) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        const { id } = request.userDetails; // Extract user ID from authenticated user

        const insertFeedbackQuery = `INSERT INTO feedback (resume_id, user_id, skills, projects, feedback) VALUES (?, ?, ?, ?, ?)`;

        await new Promise((resolve, reject) => {
            db.run(insertFeedbackQuery, [resumeId, id, skills, projects, feedback], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        response.json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error(`Failed to submit feedback: ${error.message}`);
        response.status(500).json({ error: 'Failed to submit feedback' });
    }
});

app.get('/api/alumni/:id', checkUserAuth, async (request, response) => {
    const { id } = request.params;
    console.log(id)
    const getAlumniDetails = `
        SELECT u.name, a.email, a.linkedin, a.curr_role 
        FROM users u 
        JOIN alumni a ON u.id = a.user_id 
        WHERE u.id = ?
    `;

    try {
        const userDetails = await new Promise((resolve, reject) => {
            db.get(getAlumniDetails, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!userDetails) {
            console.log("No alumni found for the user");
            return response.json({}); // Return an empty JSON object
        }

        response.json(userDetails);
    } catch (error) {
        console.error("Couldn't get data", error);
        response.status(500).json({ error: 'Failed to fetch alumni' });
    }
});


app.get('/api/feedback', checkUserAuth, async (request, response) => {
    const { id, role } = request.userDetails;
    console.log(role);

    const selectFeedbackQuery = `
        SELECT f.user_id, f.skills, f.projects, f.feedback 
        FROM feedback f, resumes r 
        WHERE r.id = f.resume_id AND r.user_id = ?
    `;

    try {
        const feedback = await new Promise((resolve, reject) => {
            db.all(selectFeedbackQuery, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (feedback.length === 0) {
            console.log("No feedback found for the user");
            return response.json([]); // Return an empty array as there is no feedback
        }

        console.log("Extracted feedback");
        response.json(feedback);
    } catch (error) {
        console.error(`Failed to fetch feedback: ${error.message}`);
        response.status(500).json({ error: 'Failed to fetch feedback' });
    }
});



