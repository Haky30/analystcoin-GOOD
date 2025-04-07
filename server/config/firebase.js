const admin = require('firebase-admin');

function initializeFirebaseAdmin() {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin');
  }
}

const firebaseAdmin = initializeFirebaseAdmin();

module.exports = {
  admin: firebaseAdmin,
  firestore: firebaseAdmin.firestore(),
  auth: firebaseAdmin.auth()
};