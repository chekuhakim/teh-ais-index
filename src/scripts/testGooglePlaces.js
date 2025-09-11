// Test Google Places API integration
import { googlePlacesService } from '../services/googlePlacesService.js';

async function testGooglePlaces() {
  try {
    console.log('🔍 Testing Google Places API...');
    
    // Test search for a Malaysian restaurant
    const results = await googlePlacesService.searchRestaurants('Restoran Pelita', {
      lat: 3.1390,
      lng: 101.6869
    });
    
    console.log(`✅ Found ${results.length} restaurants`);
    
    if (results.length > 0) {
      const restaurant = googlePlacesService.convertGooglePlaceToRestaurant(results[0]);
      console.log('📍 Sample restaurant data:');
      console.log(`   Name: ${restaurant.name}`);
      console.log(`   Address: ${restaurant.address}`);
      console.log(`   Rating: ${restaurant.rating} ⭐`);
      console.log(`   Price Level: ${restaurant.priceLevel || 'Not available'}`);
      console.log(`   Specialties: ${restaurant.specialties.join(', ')}`);
    }
    
    console.log('🎉 Google Places API is working correctly!');
    
  } catch (error) {
    console.error('❌ Google Places API test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('💡 Make sure your API key is correct and Places API is enabled');
    } else if (error.message.includes('quota')) {
      console.log('💡 API quota exceeded. Check your usage limits');
    } else {
      console.log('💡 Check your internet connection and API key permissions');
    }
  }
}

// Run the test
testGooglePlaces();
