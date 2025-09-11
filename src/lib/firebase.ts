import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfigService } from '@/services/firebaseConfigService';

// Firebase configuration - loaded from environment variables only
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingEnvVars);
  throw new Error(`Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`);
}

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
