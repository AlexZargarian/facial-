const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the limit to handle large images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// MySQL database connection setup
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

// User signup endpoint
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
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

// User login endpoint
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

// Get classes endpoint
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

// Recognize frame endpoint
app.post('/recognize-frame', (req, res) => {
    const { image } = req.body;
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFile("frame.jpg", base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).json({ message: "Error saving the frame", error: err });
        }

        const pythonProcess = spawn('python', ['./smart_attendance.py'], { stdio: ['pipe', 'pipe', 'pipe'] });

        let errorOutput = '';

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
            res.status(200).json({ message: "Facial recognition script executed successfully" });
        });
    });
});

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
