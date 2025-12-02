import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - loaded from environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Auth with browser persistence
export const firebaseAuth = getAuth(firebaseApp);

// Set persistence to LOCAL (survives browser restarts)
setPersistence(firebaseAuth, browserLocalPersistence);

// Initialize Firestore
export const firebaseDb = getFirestore(firebaseApp);

// Export alias for convenience
export const db = firebaseDb;
export const app = firebaseApp;

console.log('[Firebase] Initialized for web dashboard');