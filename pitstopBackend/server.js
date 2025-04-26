// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/restrooms', require('./routes/restrooms'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));

// Basic test route
app.get('/', (req, res) => {
    res.send('PitStop Backend is Running 🚽✨');
});

// Start server
app.listen(PORT, () => {
    console.log(`PitStop Backend server is running on port ${PORT}`);
});
