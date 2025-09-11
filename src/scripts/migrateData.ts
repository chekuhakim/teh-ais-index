import { RestaurantService } from '@/services/restaurantService';
import { mockRestaurants } from '@/data/mockRestaurants';

export const migrateMockDataToFirebase = async () => {
  console.log('Starting data migration to Firebase...');
  
  try {
    for (const restaurant of mockRestaurants) {
      const { id, ...restaurantData } = restaurant;
      const newId = await RestaurantService.addRestaurant(restaurantData);
      console.log(`Migrated restaurant: ${restaurant.name} (ID: ${newId})`);
    }
    
    console.log('✅ Data migration completed successfully!');
  } catch (error) {
    console.error('❌ Data migration failed:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.hot) {
  // Only run in development
  console.log('Data migration script loaded. Call migrateMockDataToFirebase() to migrate data.');
}
