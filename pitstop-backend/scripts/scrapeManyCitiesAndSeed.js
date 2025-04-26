/**
 * @file scrapeManyCitiesAndSeed.js
 * @description
 * Scrapes public restroom data across many Idaho cities using Google Places API and uploads to Firebase Firestore.
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

// 🚀 Your API key
const GOOGLE_API_KEY = "AIzaSyDFt83mGQs2azSC2ohng_GSPUD4fmlER0o"; // <<--- REPLACE this with quotes

// List of Idaho cities to search
const cities = [
    "Aberdeen", "Acequia", "Albion", "American Falls", "Ammon", "Arco", "Arimo", "Ashton",
    "Athol", "Atomic City", "Bancroft", "Basalt", "Bellevue", "Blackfoot", "Bliss", "Bloomington",
    "Boise", "Bonners Ferry", "Bovill", "Buhl", "Burley", "Butte City", "Caldwell", "Cambridge",
    "Carey", "Cascade", "Castleford", "Challis", "Chubbuck", "Clark Fork", "Clarkston", "Clayton",
    "Clifton", "Cobalt", "Coeur d'Alene", "Cottonwood", "Council", "Craigmont", "Crouch",
    "Dayton", "Deary", "Declo", "Dietrich", "Donnelly", "Dover", "Downey", "Driggs", "Dubois",
    "Eagle", "East Hope", "Eden", "Elk River", "Ellis", "Emmett", "Fairfield", "Ferdinand",
    "Filer", "Firth", "Fish Haven", "Franklin", "Fruitland", "Garden City", "Genesee", "Georgetown",
    "Glenns Ferry", "Gooding", "Grace", "Grand View", "Grangeville", "Greenleaf", "Hagerman",
    "Hailey", "Hamer", "Hansen", "Harrison", "Hayden", "Hazelton", "Heyburn", "Homedale",
    "Hope", "Horseshoe Bend", "Huetter", "Idaho City", "Idaho Falls", "Inkom", "Iona",
    "Irwin", "Island Park", "Jerome", "Juliaetta", "Kamiah", "Kellogg", "Kendrick", "Ketchum",
    "Kimberly", "Kooskia", "Kootenai", "Laclede", "Lapwai", "Leadore", "Lewiston", "Lewisville",
    "Lowman", "Malad City", "Malta", "Marsing", "McCall", "McCammon", "Meadows Valley", "Melba",
    "Menan", "Meridian", "Middleton", "Minidoka", "Montpelier", "Moore", "Moscow", "Mountain Home",
    "Moyie Springs", "Mud Lake", "Mullan", "Murtaugh", "Naples", "New Meadows", "New Plymouth",
    "Nezperce", "Notus", "Oakley", "Oldtown", "Onaway", "Orofino", "Osburn", "Oxford",
    "Parma", "Paul", "Payette", "Pierce", "Pinehurst", "Placerville", "Plummer", "Pocatello",
    "Pollock", "Post Falls", "Potlatch", "Preston", "Priest River", "Rathdrum", "Reubens",
    "Rexburg", "Richfield", "Rigby", "Riggins", "Roberts", "Rockland", "Rupert", "Salmon",
    "Sandpoint", "Shelley", "Shoshone", "Smelterville", "Soda Springs", "Spirit Lake",
    "St. Anthony", "St. Charles", "St. Maries", "Stanley", "Star", "Sugar City", "Sun Valley",
    "Swan Valley", "Tensed", "Tetonia", "Troy", "Twin Falls", "Victor", "Viola", "Wallace",
    "Wardner", "Weippe", "Weiser", "Wendell", "Weston", "White Bird", "Wilder", "Worley"

// You can add even more if you want 1000+
];

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch public restrooms for a single city.
 */
async function fetchCityRestrooms(city) {
    console.log(`🔍 Searching restrooms in ${city}...`);

    const allResults = [];
    let pageToken = null;
    let tries = 0;

    do {
        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=public+restroom+in+${encodeURIComponent(city)}&key=${GOOGLE_API_KEY}`;
        if (pageToken) {
            url += `&pagetoken=${pageToken}`;
        }

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            console.error(`❌ Error for ${city}:`, data.status, data.error_message);
            return allResults;
        }

        if (data.results.length > 0) {
            console.log(`✅ Found ${data.results.length} restrooms on page ${tries + 1} for ${city}.`);
            allResults.push(...data.results.map(place => ({
                name: place.name || "Public Restroom",
                description: place.formatted_address || "No description available.",
                lat: place.geometry.location.lat,
                lon: place.geometry.location.lng
            })));
        }

        pageToken = data.next_page_token;

        if (pageToken) {
            console.log(`⏳ Waiting for next page for ${city}...`);
            await sleep(2000); // Must wait ~2 seconds for next_page_token to activate
        }

        tries++;
    } while (pageToken && tries < 3);

    return allResults;
}

/**
 * Upload restrooms to Firestore
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
    let allRestrooms = [];

    for (const city of cities) {
        const restrooms = await fetchCityRestrooms(city);
        allRestrooms.push(...restrooms);
    }

    console.log(`🎯 Total restrooms found: ${allRestrooms.length}`);
    if (allRestrooms.length > 0) {
        await seedRestrooms(allRestrooms);
    } else {
        console.log('⚠️ No restrooms found.');
    }
}

main();
