const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming you have a db module for database connection


//router for registration of new user
router.post('/register', async (req, res) => {
    try {
        console.log("Received registration request:", req.body);

        const { name, department, designation, email, phone_number, staff_code, password } = req.body;

        // Validate input (you can add more validations as needed)
        if (!name || !department || !designation || !email || !phone_number || !staff_code || !password) {
            console.log('Missing fields:', req.body);
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the connection is alive
        db.ping(err => {
            if (err) {
                console.error('MySQL ping failed:', err);
                return res.status(500).json({ message: 'Database connection error' });
            }
        });

        // Insert into StaffDetails table
        const insertStaffQuery = `
            INSERT INTO StaffDetails (name, staff_code, department, designation, email, phone_number, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        console.log("Executing query:", insertStaffQuery);
        await db.query(insertStaffQuery, [name, staff_code, department, designation, email, phone_number, password]);

        // Insert into Login table
        const insertLoginQuery = `
            INSERT INTO Login (user, password, staff_code, role)
            VALUES (?, ?, ?, 'Staff')
        `;
        console.log("Executing query:", insertLoginQuery);
        await db.query(insertLoginQuery, [email, password, staff_code]);

        console.log("User registered successfully");
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});


module.exports = router;
