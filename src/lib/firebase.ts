import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfigService } from '@/services/firebaseConfigService';

// Firebase configuration - will be loaded from Netlify function
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAozZRx8045BAEQKUYSevoOWdZRHU66VVM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mamak-a7768.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mamak-a7768",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mamak-a7768.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "267473900939",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:267473900939:web:085e452bc4d0648bf08b8e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DP4TVFMK13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Function to update Firebase config from Netlify function
export const updateFirebaseConfig = async () => {
  try {
    const config = await firebaseConfigService.getConfig();
    // Note: Firebase app is already initialized, so we can't change the config
    // This is mainly for logging and validation
    console.log('Firebase config loaded from Netlify function:', config);
    return config;
  } catch (error) {
    console.warn('Failed to load Firebase config from Netlify function, using fallback:', error);
    return firebaseConfig;
  }
};

export default app;
