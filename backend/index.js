const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login'); 

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Use API routes
app.use('/api', registerRoute);
app.use('/api', loginRoute); 


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../hall-allotment/dist')));

// A test route to confirm the server is running
// Note: This route should be placed above the catchall route if you want to keep it.
// However, it's better to remove it to ensure your React app loads properly.
app.get('/server-status', (req, res) => {
    res.send('Server is running successfully!');
});

// The "catchall" handler: for any request that doesn't match one above,
// send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../hall-allotment/dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



