const admin = require('firebase-admin');
require('dotenv').config();

let db = null;

const initFirebase = () => {
    if (admin.apps.length > 0) {
        db = admin.database();
        return;
    }

    const requiredVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_DATABASE_URL'
    ];

    const missingVars = requiredVars.filter(v => !process.env[v] || process.env[v].includes('your-'));

    if (missingVars.length > 0) {
        console.warn('⚠️  Firebase nije konfigurisan. Nedostaju varijable:', missingVars.join(', '));
        console.warn('   Kopiraj server/.env.example u server/.env i popuni Firebase kredencijale.');
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Zamijeni \n escape sekvence u pravim newline karakterima
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });

        db = admin.database();
        console.log('✅ Firebase Admin SDK inicijalizovan');
    } catch (error) {
        console.error('❌ Firebase inicijalizacija neuspješna:', error.message);
    }
};

initFirebase();

const getDb = () => db;

module.exports = { getDb };
