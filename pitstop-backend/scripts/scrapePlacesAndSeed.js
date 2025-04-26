/**
 * @file scrapePlacesAndSeed.js
 * @description
 * Scrapes public restroom data from Google Places API and uploads to Firebase Firestore.
 */

const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

// Load Firebase
const serviceAccount = require(path.join(__dirname, '../firebaseKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🚀 YOUR GOOGLE API KEY
const GOOGLE_API_KEY = "AIzaSyDFt83mGQs2azSC2ohng_GSPUD4fmlER0o"; // <<-- ⬅️ Replace this safely

/**
 * Fetch public restrooms in Boise using Google Places Text Search API.
 */
async function fetchRestroomsFromGoogle() {
    const query = "public restroom in Boise Idaho";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);

        if (response.data.status !== 'OK') {
            console.error('❌ Google Places API error:', response.data.status, response.data.error_message);
            return [];
        }

        const results = response.data.results;

        console.log(`✅ Fetched ${results.length} restrooms from Google Places.`);

        return results.map(place => ({
            name: place.name || "Public Restroom",
            description: place.formatted_address || "No description available.",
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng
        }));

    } catch (error) {
        console.error('❌ Error fetching Google Places data:', error.message);
        throw error;
    }
}

/**
 * Seed restrooms into Firestore
 */
async function seedRestrooms(restrooms) {
    const batch = db.batch();
    const restroomCollection = db.collection('restrooms');

    restrooms.forEach((restroom) => {
        const docRef = restroomCollection.doc();
        batch.set(docRef, restroom);
    });

    try {
        await batch.commit();
        console.log(`🚀 Successfully seeded ${restrooms.length} restrooms to Firebase.`);
    } catch (error) {
        console.error('❌ Error writing to Firestore:', error.message);
    }
}

/**
 * Main Runner
 */
async function main() {
    try {
        const restrooms = await fetchRestroomsFromGoogle();
        if (restrooms.length > 0) {
            await seedRestrooms(restrooms);
        } else {
            console.log('⚠️ No restrooms found.');
        }
    } catch (error) {
        console.error('❌ Script failed:', error.message);
    }
}

main();
