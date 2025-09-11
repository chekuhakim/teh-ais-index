# Firebase Auth Unauthorized Domain Fix

## Problem
You're getting `Firebase: Error (auth/unauthorized-domain)` when using your Netlify domain. This happens because Firebase Auth doesn't recognize your Netlify domain as an authorized domain.

## Solution

### Method 1: Using Firebase Console (Recommended)

1. **Open Firebase Console**
   ```bash
   # Open your browser to the Firebase Console
   open https://console.firebase.google.com/
   ```

2. **Navigate to Authentication Settings**
   - Select your project: `mamak-a7768`
   - Go to "Authentication" in the left sidebar
   - Click on "Settings" tab
   - Scroll down to "Authorized domains" section

3. **Add Your Netlify Domain**
   - Click "Add domain"
   - Enter your Netlify domain (e.g., `your-app-name.netlify.app`)
   - Click "Add"

### Method 2: Using Firebase CLI

1. **Open Authentication in Browser**
   ```bash
   # This will open the Firebase Console directly to the Auth section
   firebase open auth
   ```

2. **Add Domain Manually**
   - Follow the same steps as Method 1

### Method 3: Programmatic Solution (Advanced)

If you need to add domains programmatically, you can use the Firebase Admin SDK or REST API:

```javascript
// Example using Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize admin SDK with service account
const serviceAccount = require('./path-to-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Note: Adding authorized domains programmatically requires
// using the Firebase Auth REST API or Google Cloud Identity API
```

## Common Netlify Domain Patterns

Your Netlify domain will typically be one of these formats:
- `your-app-name.netlify.app` (default)
- `your-custom-domain.com` (if you have a custom domain)
- `random-name-123456.netlify.app` (if auto-generated)

## Verification

After adding the domain:

1. **Test Authentication**
   - Deploy your app to Netlify
   - Try to sign in/up
   - Check browser console for errors

2. **Check Console Logs**
   ```bash
   # Use the browser MCP tool to check console logs
   # This will help verify the fix worked
   ```

## Troubleshooting

### If you still get the error:

1. **Check Domain Format**
   - Ensure no trailing slashes
   - Ensure no `https://` prefix
   - Use the exact domain from your Netlify dashboard

2. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache and cookies

3. **Check Firebase Config**
   - Ensure `authDomain` in your Firebase config matches your project
   - Should be: `mamak-a7768.firebaseapp.com`

4. **Verify Project ID**
   - Your project ID is: `mamak-a7768`
   - Make sure this matches your environment variables

## Environment Variables Check

Make sure your `.env.local` has the correct values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=mamak-a7768.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mamak-a7768
VITE_FIREBASE_STORAGE_BUCKET=mamak-a7768.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Next Steps

1. Add your Netlify domain to authorized domains
2. Redeploy your Netlify app
3. Test authentication functionality
4. Check console logs for any remaining errors

## Quick Commands

```bash
# Check current Firebase project
firebase projects:list

# Open Firebase Console
firebase open

# Check Firebase apps
firebase apps:list

# Deploy to test
npm run build && netlify deploy --prod
```
