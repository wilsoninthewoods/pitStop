/**
 * @file server.js
 * @description Main entry point for the PitStop Backend server.
 * Sets up Express application, middleware, routes, and starts the server.
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');          // Web framework for Node.js
const cors = require('cors');                // Middleware to enable CORS (Cross-Origin Resource Sharing)

// Initialize Express application
const app = express();

// Define server port, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT || 3001;

/**
 * Apply Middleware
 *
 * - Enables CORS for all requests
 * - Parses incoming request bodies as JSON
 */
app.use(cors());
app.use(express.json()); // Modern Express has built-in JSON parser

/**
 * Register API routes
 *
 * Delegates handling of specific endpoints to separate route modules.
 */
app.use('/api/restrooms', require('./routes/restrooms')); // Routes related to restrooms
app.use('/api/reviews', require('./routes/reviews'));     // Routes related to reviews
app.use('/api/users', require('./routes/users'));         // Routes related to users

/**
 * Basic health check endpoint
 *
 * @name GET /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {String} Confirmation message that the backend is running
 */
app.get('/', (req, res) => {
    res.send('PitStop Backend is Running 🚽✨');
});

/**
 * Error handling middleware
 *
 * Catches and handles any errors thrown during request processing.
 *
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

/**
 * Start server
 *
 * Begins listening for incoming HTTP requests on the defined port.
 * Logs a confirmation message once the server is successfully running.
 */
app.listen(PORT, () => {
    console.log(`PitStop Backend server is running on port ${PORT}`);
});
