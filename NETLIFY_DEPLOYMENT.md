# Netlify Deployment Guide

## 🚀 **Preparing for Netlify Deployment**

### ✅ **What I've Set Up:**

1. **Netlify Functions**: Created serverless functions to hide API keys
2. **Updated Services**: Modified frontend to use Netlify functions
3. **Configuration**: Added netlify.toml for deployment settings
4. **Security**: Moved all sensitive API keys to server-side functions

## 📁 **Project Structure:**

```
mamak-ais-price/
├── netlify/
│   └── functions/
│       ├── google-places.js      # Google Places API function
│       ├── mapbox.js             # Mapbox API function
│       └── firebase-config.js    # Firebase config function
├── netlify.toml                  # Netlify configuration
├── src/
│   └── services/
│       ├── googlePlacesServiceNetlify.ts
│       ├── mapboxServiceNetlify.ts
│       └── firebaseConfigService.ts
└── package.json                  # Added netlify dev script
```

## 🔧 **API Keys Moved to Netlify Functions:**

### **Before (Frontend - Insecure):**
```typescript
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... other config
};
```

### **After (Backend - Secure):**
```javascript
// netlify/functions/google-places.js
const apiKey = process.env.GOOGLE_PLACES_API_KEY;

// netlify/functions/mapbox.js
const apiKey = process.env.MAPBOX_TOKEN;

// netlify/functions/firebase-config.js
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  // ... other config
};
```

## 🌐 **Environment Variables to Set in Netlify:**

Go to **Site Settings > Environment Variables** in your Netlify dashboard and add:

```bash
# Google Places API
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Mapbox API
MAPBOX_TOKEN=your-mapbox-token

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 🚀 **Deployment Steps:**

### **1. Install Netlify CLI (Already Done):**
```bash
npm install -g netlify-cli
```

### **2. Login to Netlify:**
```bash
netlify login
```

### **3. Initialize Netlify Site:**
```bash
netlify init
```

### **4. Set Environment Variables:**
```bash
# Set each environment variable
netlify env:set GOOGLE_PLACES_API_KEY "your-google-places-api-key"
netlify env:set MAPBOX_TOKEN "your-mapbox-token"
netlify env:set FIREBASE_API_KEY "your-firebase-api-key"
netlify env:set FIREBASE_AUTH_DOMAIN "your-project.firebaseapp.com"
netlify env:set FIREBASE_PROJECT_ID "your-project-id"
netlify env:set FIREBASE_STORAGE_BUCKET "your-project.appspot.com"
netlify env:set FIREBASE_MESSAGING_SENDER_ID "your-sender-id"
netlify env:set FIREBASE_APP_ID "your-app-id"
netlify env:set FIREBASE_MEASUREMENT_ID "your-measurement-id"
```

### **5. Deploy:**
```bash
netlify deploy --prod
```

## 🧪 **Local Development with Netlify Functions:**

### **Start Netlify Dev Server:**
```bash
npm run dev:netlify
```

This will:
- Start the Vite dev server on port 8888
- Start Netlify functions on port 8888
- Enable local testing of serverless functions

### **Test Functions Locally:**
```bash
# Test Google Places function
curl -X POST http://localhost:8888/.netlify/functions/google-places \
  -H "Content-Type: application/json" \
  -d '{"action": "search", "query": "mamak", "location": {"lat": 3.1390, "lng": 101.6869}}'

# Test Mapbox function
curl -X POST http://localhost:8888/.netlify/functions/mapbox \
  -H "Content-Type: application/json" \
  -d '{"action": "geocoding", "query": "Kuala Lumpur", "country": "MY"}'

# Test Firebase config function
curl http://localhost:8888/.netlify/functions/firebase-config
```

## 🔒 **Security Benefits:**

### **1. API Keys Hidden:**
- No API keys in frontend code
- No API keys in public repository
- Keys only accessible server-side

### **2. Rate Limiting:**
- Server-side rate limiting possible
- API usage monitoring
- Cost control

### **3. CORS Protection:**
- Functions handle CORS properly
- Only your domain can call functions
- No direct API access from frontend

## 📊 **Function Endpoints:**

### **Google Places Function:**
```
POST /.netlify/functions/google-places
{
  "action": "search|nearby|details",
  "query": "mamak restaurant",
  "location": {"lat": 3.1390, "lng": 101.6869},
  "radius": 5000
}
```

### **Mapbox Function:**
```
POST /.netlify/functions/mapbox
{
  "action": "geocoding|reverse-geocoding",
  "query": "Kuala Lumpur",
  "country": "MY",
  "limit": 1
}
```

### **Firebase Config Function:**
```
GET /.netlify/functions/firebase-config
```

## 🎯 **Frontend Changes:**

### **1. Google Places Service:**
```typescript
// Before
import { googlePlacesService } from '@/services/googlePlacesService';

// After
import { googlePlacesServiceNetlify } from '@/services/googlePlacesServiceNetlify';
```

### **2. Mapbox Service:**
```typescript
// Before
const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`);

// After
import { mapboxServiceNetlify } from '@/services/mapboxServiceNetlify';
const result = await mapboxServiceNetlify.searchLocation(query);
```

### **3. Firebase Config:**
```typescript
// Before
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ...
};

// After
import { firebaseConfigService } from '@/services/firebaseConfigService';
const config = await firebaseConfigService.getConfig();
```

## 🚨 **Important Notes:**

1. **Environment Variables**: Must be set in Netlify dashboard before deployment
2. **Function Timeout**: Netlify functions have a 10-second timeout
3. **Cold Starts**: First function call may be slower
4. **Caching**: Consider adding caching for better performance
5. **Error Handling**: Functions include proper error handling and CORS

## ✅ **Ready for Deployment:**

Your app is now ready for Netlify deployment with:
- ✅ Secure API key management
- ✅ Serverless functions for all external APIs
- ✅ Proper CORS handling
- ✅ Error handling and fallbacks
- ✅ Local development support

## 🎉 **Next Steps:**

1. Set up your Netlify account
2. Set environment variables
3. Deploy with `netlify deploy --prod`
4. Test all functionality
5. Monitor function usage in Netlify dashboard

Your Mamak AIS Price app is now production-ready for Netlify! 🚀✨
