const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

console.log('Loading Firebase Admin SDK...'); // ADD THIS

const serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH);
console.log('Service account loaded:', serviceAccount ? '✅' : '❌'); // ADD THIS

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
console.log('Firestore initialized:', db ? '✅' : '❌'); // ADD THIS

module.exports = { admin, db };
