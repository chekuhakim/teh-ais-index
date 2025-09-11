import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq",
  authDomain: "mamak-a7768.firebaseapp.com",
  projectId: "mamak-a7768",
  storageBucket: "mamak-a7768.appspot.com",
  messagingSenderId: "267473900939",
  appId: "1:267473900939:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkFirestoreData() {
  try {
    console.log('🔍 Checking Firestore data...');
    
    // Get all restaurants
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Found ${querySnapshot.docs.length} restaurants:`);
    
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.name} (${doc.id})`);
      console.log(`  Address: ${data.address}`);
      console.log(`  Price: RM ${data.tehAisPrice}`);
      console.log(`  Last Updated: ${data.lastUpdated}`);
      console.log(`  Last Updated By: ${data.lastUpdatedBy}`);
      console.log('---');
    });
    
    // Check for Puncak Rasa specifically
    const puncakRasa = querySnapshot.docs.find(doc => 
      doc.data().name.toLowerCase().includes('puncak rasa')
    );
    
    if (puncakRasa) {
      console.log('✅ Found Puncak Rasa Mamak!');
      console.log('Data:', puncakRasa.data());
    } else {
      console.log('❌ Puncak Rasa Mamak not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking Firestore data:', error);
  }
}

checkFirestoreData();
