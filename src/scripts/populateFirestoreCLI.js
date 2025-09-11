// Script to populate Firestore with sample data using Firebase Admin SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAozZRx8045BAEQKUYSevoOWdZRHU66VVM",
  authDomain: "mamak-a7768.firebaseapp.com",
  projectId: "mamak-a7768",
  storageBucket: "mamak-a7768.firebasestorage.app",
  messagingSenderId: "267473900939",
  appId: "1:267473900939:web:085e452bc4d0648bf08b8e",
  measurementId: "G-DP4TVFMK13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleRestaurants = [
  {
    name: 'Mamak Corner SS15',
    address: 'Jalan SS 15/4b, Ss 15, 47500 Subang Jaya, Selangor',
    coordinates: { lat: 3.0738, lng: 101.5183 },
    tehAisPrice: 1.80,
    rating: 4.2,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Roti Canai', 'Teh Ais', 'Mee Goreng'],
    lastUpdated: '2024-01-15T10:30:00Z',
    reviewCount: 1247,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Restoran Pelita',
    address: 'Jalan Ampang, Kuala Lumpur',
    coordinates: { lat: 3.1390, lng: 101.6869 },
    tehAisPrice: 2.20,
    rating: 4.5,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Nasi Kandar', 'Teh Ais', 'Curry'],
    lastUpdated: '2024-01-14T16:45:00Z',
    reviewCount: 2156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mamak Cyberjaya',
    address: 'Persiaran Cyberpoint Selatan, Cyberjaya, Selangor',
    coordinates: { lat: 2.9213, lng: 101.6559 },
    tehAisPrice: 2.50,
    rating: 4.0,
    isOpen: false,
    openHours: '6:00 AM - 2:00 AM',
    specialties: ['Maggi Goreng', 'Teh Ais', 'Roti Tissue'],
    lastUpdated: '2024-01-13T20:15:00Z',
    reviewCount: 856,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function populateFirestore() {
  try {
    console.log('🚀 Starting to populate Firestore with sample data...');
    
    const restaurantsRef = collection(db, 'restaurants');
    
    for (const restaurant of sampleRestaurants) {
      const docRef = await addDoc(restaurantsRef, restaurant);
      console.log(`✅ Added: ${restaurant.name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully populated Firestore with sample data!');
    console.log('Your app should now load with real Firebase data.');
    
  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
  }
}

// Run the population
populateFirestore();
