import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - same as mobile app for data synchronization
const firebaseConfig = {
  apiKey: "AIzaSyCCvltpzk9atQw04kfNn1i_DSttaRt0iz4",
  authDomain: "pvt-app-440c9.firebaseapp.com",
  projectId: "pvt-app-440c9",
  storageBucket: "pvt-app-440c9.firebasestorage.app",
  messagingSenderId: "629740230590",
  appId: "1:629740230590:web:6369829122066d4a1c8bef",
  measurementId: "G-49YJZ0W5R4"
};

// Initialize Firebase app
export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Auth with browser persistence
export const firebaseAuth = getAuth(firebaseApp);

// Set persistence to LOCAL (survives browser restarts)
setPersistence(firebaseAuth, browserLocalPersistence);

// Initialize Firestore
export const firebaseDb = getFirestore(firebaseApp);

console.log('[Firebase] Initialized for web dashboard');