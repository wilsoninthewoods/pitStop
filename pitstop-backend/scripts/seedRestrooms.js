/**
 * @file seedRestrooms.js
 * @description
 * Seeds the Firestore database with public restroom data for Boise.
 * Run manually using: node scripts/seedRestrooms.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../firebaseKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Real Boise public restrooms (you can add more!)
const restrooms = [
    {
        name: "MBEB – First Floor Restroom",
        description: "Located near the Skaggs Hall of Learning in the southwest corner.",
        lat: 43.6035,
        lon: -116.2020
    },
    {
        name: "MBEB – Second Floor Restroom",
        description: "Adjacent to the Imagination Lab in the annex.",
        lat: 43.6035,
        lon: -116.2020
    },
    {
        name: "MBEB – Third Floor Restroom",
        description: "Near the Department of Accountancy offices.",
        lat: 43.6035,
        lon: -116.2020
    },
    {
        name: "MBEB – Fourth Floor Restroom",
        description: "Close to the Executive Education Classroom and MBA program offices.",
        lat: 43.6035,
        lon: -116.2020
    }
];
restrooms.push(
    {
        name: "Education Building – First Floor Restroom",
        description: "Near the main entrance and lobby area.",
        lat: 43.6038,
        lon: -116.2070
    },
    {
        name: "Education Building – Second Floor Restroom",
        description: "Adjacent to room E220, the Esports Battlegrounds.",
        lat: 43.6038,
        lon: -116.2070
    },
    {
        name: "Education Building – Sixth Floor Restroom",
        description: "Located near the PSYCH Conference Room.",
        lat: 43.6038,
        lon: -116.2070
    }
);

async function seed() {
    const batch = db.batch();

    restrooms.forEach((restroom) => {
        const docRef = db.collection('restrooms').doc(); // auto-generated id
        batch.set(docRef, restroom);
    });

    try {
        await batch.commit();
        console.log(`✅ Successfully seeded ${restrooms.length} restrooms.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding restrooms:', error);
        process.exit(1);
    }
}

seed();
