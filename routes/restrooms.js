// routes/restrooms.js
const express = require('express');
const router = express.Router();
const { getAllRestrooms } = require('../controllers/restroomController');

// GET /api/restrooms
router.get('/', getAllRestrooms);

module.exports = router;
