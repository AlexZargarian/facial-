const mysql = require('mysql2');
const axios = require('axios');
const bcrypt = require('bcrypt');



const express = require('express');
const cors = require('cors');
const {PythonShell} = require("python-shell");
const {readFile} = require("node:fs");
const app = express();
const { spawn } = require('child_process');


app.use(cors());





app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: "Aa09120304072",
    port: 3306,
    database: 'connect'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing the password", error: err });
        }

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hash], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error inserting the user", error: err });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error logging in", error: err });
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    res.status(200).json({ message: "Login successful" });
                } else {
                    res.status(404).json({ message: "Incorrect credentials" });
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});


app.get('/getClasses', (req, res) => {
    if (!req.query.email) {
        return res.status(400).json({ message: "Email parameter is required" });
    }

    db.query("SELECT * FROM classes WHERE teacher_email = ?", [req.query.email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving classes", error: err });
        }
        res.status(200).json(results);
    });
});


app.post('/start-recognition', (req, res) => {
    const pythonProcess = spawn('python', ['./smart_attendance.py'], { stdio: ['pipe', 'pipe', 'pipe'] });

    let dataOutput = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        dataOutput += data.toString();
        console.log(`stdout: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`stderr: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(`Python script stderr: ${errorOutput}`);
            return res.status(500).json({ message: "Facial recognition script failed", error: errorOutput });
        }
        res.status(200).json({ message: "Facial recognition script executed successfully", output: dataOutput });
    });
});


app.listen(8081, () => {
    console.log("Server started on port 8081");
});