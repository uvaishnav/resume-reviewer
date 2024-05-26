const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(()=>{
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT
    )`);

    db.run(`CREATE TABLE resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        file_path TEXT,
        apply_role TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resume_id INTEGER,
        user_id INTEGER,
        skills TEXT,
        projects TEXT,
        feedback TEXT,
        FOREIGN KEY(resume_id) REFERENCES resumes(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT,
        cgpa REAL,
        curr_year INTEGER,
        branch TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE alumni (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT,
        linkedin TEXT,
        curr_role TEXT,
        suggest_roles TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);
    
})

module.exports = db;