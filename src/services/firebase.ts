import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Placeholder configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

let app;
let db: any = null;

if (isConfigValid) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        db = getDatabase(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase is using placeholder keys. CRUD will fall back to local storage.");
}

export { db };
