const admin = require('firebase-admin');
const serviceAccount = require('../firebaseKey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

module.exports = { admin, db };
