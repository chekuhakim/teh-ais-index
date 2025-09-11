// Firestore Security Rules for Mamak AIS Price
// Copy and paste these rules into your Firebase Console

const firestoreRules = `rules_version = '2';
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
}`;

console.log('🔥 Firestore Security Rules');
console.log('==========================');
console.log('');
console.log('Copy these rules to your Firebase Console:');
console.log('');
console.log('1. Go to: https://console.firebase.google.com/project/mamak-a7768/firestore/rules');
console.log('2. Replace existing rules with the rules below');
console.log('3. Click "Publish"');
console.log('');
console.log('Rules:');
console.log('------');
console.log(firestoreRules);
console.log('');
console.log('After setting up rules, your app will connect to Firebase successfully!');

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firestoreRules };
}
