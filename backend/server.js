const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');  // Import path module
const taskRoutes = require('./taskRoutes');  // Correct path to taskRoutes
const db = require('./db');  // Import database connection (adjust the path if needed)

const app = express();
const PORT = process.env.PORT || 3000;

// Use middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));  // Adjusted to serve static files from frontend

// Mount the task routes with the `/api` prefix
app.use('/api', taskRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, 'localhost', () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});