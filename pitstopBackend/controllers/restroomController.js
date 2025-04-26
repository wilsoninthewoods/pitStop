// controllers/restroomController.js
const { db } = require('../services/firebaseService');

// Get all restrooms
async function getAllRestrooms(req, res) {
    try {
        const restroomsRef = db.collection('restrooms');
        const snapshot = await restroomsRef.get();

        const restrooms = [];
        snapshot.forEach(doc => {
            restrooms.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(restrooms);
    } catch (error) {
        console.error('Error getting restrooms:', error);
        res.status(500).send('Failed to fetch restrooms');
    }
}

module.exports = { getAllRestrooms };
