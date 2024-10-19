const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Router for login of a registered user
router.post('/login', (req, res) => {
    const { staff_code, password } = req.body;

    // Check if both staff_code and password are provided
    if (!staff_code || !password) {
        return res.status(400).json({ message: 'Staff ID and password are required' });
    }

    // Query to find the user
    const query = 'SELECT * FROM Login WHERE staff_code = ? AND password = ?';
    db.query(query, [staff_code, password], (error, results) => {
        if (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Server error during login' });
        }

        // Check if results is an array with at least one element
        if (results.length === 0) {
            // No matching user found
            return res.status(401).json({ message: 'Invalid Staff ID or password' });
        }

        // If the user is found, send a success message
        res.status(200).json({ message: 'Login successful', user: results[0] });
    });
});

module.exports = router;
