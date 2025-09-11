// Test script for Netlify functions
const testFunctions = async () => {
  console.log('🧪 Testing Netlify Functions...\n');

  // Test Firebase config function
  try {
    console.log('1. Testing Firebase Config Function...');
    const response = await fetch('http://localhost:8888/.netlify/functions/firebase-config');
    const data = await response.json();
    console.log('✅ Firebase Config:', data);
  } catch (error) {
    console.log('❌ Firebase Config Error:', error.message);
  }

  // Test Google Places function
  try {
    console.log('\n2. Testing Google Places Function...');
    const response = await fetch('http://localhost:8888/.netlify/functions/google-places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        query: 'mamak',
        location: { lat: 3.1390, lng: 101.6869 }
      })
    });
    const data = await response.json();
    console.log('✅ Google Places:', data);
  } catch (error) {
    console.log('❌ Google Places Error:', error.message);
  }

  // Test Mapbox function
  try {
    console.log('\n3. Testing Mapbox Function...');
    const response = await fetch('http://localhost:8888/.netlify/functions/mapbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'geocoding',
        query: 'Kuala Lumpur',
        country: 'MY'
      })
    });
    const data = await response.json();
    console.log('✅ Mapbox:', data);
  } catch (error) {
    console.log('❌ Mapbox Error:', error.message);
  }

  console.log('\n🎉 Function testing complete!');
};

// Run tests
testFunctions();
