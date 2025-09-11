# Firebase Setup Guide for Mamak AIS Price

This guide will help you set up Firebase for the Mamak AIS Price application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `mamak-ais-price` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click and toggle "Enable" (optional but recommended)

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Register your app with a nickname (e.g., "mamak-ais-price-web")
5. Copy the Firebase configuration object

## 5. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-actual-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   ```

## 6. Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Restaurants collection - readable by all, writable by authenticated users
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Prices collection - readable by all, writable by authenticated users
    match /prices/{priceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## 7. Migrate Mock Data (Optional)

If you want to populate your database with the sample restaurant data:

1. Start your development server: `npm run dev`
2. Open browser console on your app
3. Run the migration script:
   ```javascript
   import { migrateMockDataToFirebase } from './src/scripts/migrateData.ts';
   migrateMockDataToFirebase();
   ```

## 8. Test Your Setup

1. Start the development server: `npm run dev`
2. Open `http://localhost:8081` (or your assigned port)
3. You should see the map loading with data from Firebase
4. Try updating a restaurant price to test the connection

## Troubleshooting

### Common Issues:

1. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Check that your environment variables are correctly set
   - Restart your development server after updating `.env.local`

2. **"Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Ensure you're authenticated if trying to write data

3. **"Failed to fetch restaurants"**
   - Verify your Firebase project ID and API key
   - Check that Firestore is enabled in your project

4. **Map not loading**
   - Ensure your Mapbox token is correctly set
   - Check browser console for Mapbox-related errors

### Getting Help:

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- Check browser console for detailed error messages

## Next Steps

Once Firebase is set up, you can:

1. Add user authentication to your app
2. Implement real-time price updates
3. Add user reviews and ratings
4. Set up push notifications for price changes
5. Implement data analytics and reporting
