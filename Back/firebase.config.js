const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("./src/assets/pp4-uqac-firebase-adminsdk-omevd-a09bb4af64.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pp4-uqac.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
