import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDF5-iVWwwCRH-c3hPdql16GFPmDfEvgVY",
  authDomain: "test-4a262.firebaseapp.com",
  projectId: "test-4a262",
  storageBucket: "test-4a262.firebasestorage.app",
  messagingSenderId: "424078600692",
  appId: "1:424078600692:web:f24c879d9ad141966931a1",
  measurementId: "G-G1MW1C47KS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);