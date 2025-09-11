# Firestore Security Rules Setup

## Quick Fix for "Missing or insufficient permissions" Error

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/project/mamak-a7768)
2. Click on "Firestore Database" in the left sidebar
3. Click on "Rules" tab

### Step 2: Replace the Rules
Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access to authenticated users only
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /prices/{priceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow test collection for connection testing
    match /test/{testId} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Publish the Rules
1. Click "Publish" button
2. Confirm the changes

### Step 4: Test the Connection
1. Go back to your app
2. Click "Admin" → "Firebase" tab
3. Click "Recheck" to test the connection

## Alternative: Development Mode (Temporary)

If you want to test quickly without authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning**: This allows anyone to read/write your database. Only use for development!

## What These Rules Do:

- **Read Access**: Anyone can read restaurant data (for the public map)
- **Write Access**: Only authenticated users can add/edit restaurants
- **Test Collection**: Allows connection testing without authentication

## After Setting Up Rules:

1. Your app should connect to Firebase successfully
2. You'll see "Firebase connected successfully" in the admin panel
3. Data will be saved permanently to Firestore
4. The yellow "Using Sample Data" banner will disappear

## Troubleshooting:

- **Still getting errors?** Check the Firebase Console for any error messages
- **Rules not saving?** Make sure you're in the correct project (mamak-a7768)
- **Need help?** Check the browser console for detailed error messages
