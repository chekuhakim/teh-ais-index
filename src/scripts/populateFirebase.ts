import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { mockRestaurants } from '@/data/mockRestaurants';

export const populateFirebase = async () => {
  console.log('🚀 Starting Firebase population...');
  
  try {
    // Check if data already exists
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    
    if (snapshot.size > 0) {
      console.log('⚠️  Data already exists in Firebase. Skipping population.');
      console.log(`Found ${snapshot.size} existing restaurants.`);
      return;
    }

    // Add each restaurant to Firebase
    const promises = mockRestaurants.map(async (restaurant) => {
      const { id, ...restaurantData } = restaurant;
      const docRef = await addDoc(restaurantsRef, {
        ...restaurantData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Added: ${restaurant.name} (ID: ${docRef.id})`);
      return docRef.id;
    });

    const newIds = await Promise.all(promises);
    
    console.log('🎉 Firebase population completed successfully!');
    console.log(`Added ${newIds.length} restaurants to your database.`);
    console.log('You can now view them in your Firebase Console at:');
    console.log('https://console.firebase.google.com/project/mamak-a7768/firestore');
    
  } catch (error) {
    console.error('❌ Error populating Firebase:', error);
    throw error;
  }
};

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log('Firebase population script loaded. Call populateFirebase() to populate your database.');
}
