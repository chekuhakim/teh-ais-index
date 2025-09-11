export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

class FirebaseConfigService {
  private baseUrl: string;
  private config: FirebaseConfig | null = null;

  constructor() {
    // Use Netlify function URL in production, fallback to localhost in development
    this.baseUrl = import.meta.env.PROD 
      ? '/.netlify/functions/firebase-config'
      : 'http://localhost:8888/.netlify/functions/firebase-config';
  }

  async getConfig(): Promise<FirebaseConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      this.config = data;
      return data;
    } catch (error) {
      console.error('Error getting Firebase config:', error);
      
      // Fallback to environment variables if available
      const fallbackConfig: FirebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
      };

      // Check if we have at least the essential config
      if (fallbackConfig.apiKey && fallbackConfig.projectId) {
        this.config = fallbackConfig;
        return fallbackConfig;
      }

      throw error;
    }
  }
}

export const firebaseConfigService = new FirebaseConfigService();
