/**
 * @file scrapeAndSeedRestrooms.js
 * @description
 * Scrapes public restroom data from OpenStreetMap (via Overpass API)
 * and uploads it to Firebase Firestore under the 'restrooms' collection.
 */

const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin setup
const serviceAccount = require(path.join(__dirname, '../firebaseKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Fetches public restroom data from OpenStreetMap using Overpass API.
 */
async function fetchRestroomsFromOSM() {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="toilets"](43.5000,-116.4000,43.7000,-116.0500);
    );
    out body;
  `;

    try {
        const response = await axios.post(overpassUrl, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const elements = response.data.elements;
        console.log(`✅ Fetched ${elements.length} restrooms from OpenStreetMap.`);

        return elements.map(el => ({
            name: el.tags?.name || "Public Restroom",
            description: el.tags?.description || "Public restroom available.",
            lat: el.lat,
            lon: el.lon
        }));

    } catch (error) {
        console.error('❌ Error fetching data from OpenStreetMap:', error.message);
        throw error;
    }
}

/**
 * Uploads an array of restrooms to Firestore.
 */
async function seedRestrooms(restrooms) {
    const batch = db.batch();
    const restroomCollection = db.collection('restrooms');

    restrooms.forEach(restroom => {
        const docRef = restroomCollection.doc();
        batch.set(docRef, restroom);
    });

    try {
        await batch.commit();
        console.log(`🚀 Successfully seeded ${restrooms.length} restrooms to Firebase.`);
    } catch (error) {
        console.error('❌ Error seeding Firestore:', error.message);
    }
}

/**
 * Main runner
 */
async function main() {
    try {
        const restrooms = await fetchRestroomsFromOSM();
        if (restrooms.length > 0) {
            await seedRestrooms(restrooms);
        } else {
            console.log('⚠️ No restrooms found to seed.');
        }
    } catch (error) {
        console.error('❌ Script failed:', error.message);
    }
}

main();
