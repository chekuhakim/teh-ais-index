export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { action, ...params } = JSON.parse(event.body || '{}');

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Google Places API key not configured' }),
      };
    }

    let result;

    switch (action) {
      case 'search':
        result = await searchPlaces(apiKey, params);
        break;
      case 'nearby':
        result = await searchNearby(apiKey, params);
        break;
      case 'details':
        result = await getPlaceDetails(apiKey, params);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in Google Places function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function searchPlaces(apiKey, { query, location, radius = 5000 }) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location.lat},${location.lng}&radius=${radius}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

async function searchNearby(apiKey, { location, radius = 5000, type = 'restaurant' }) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&keyword=mamak&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

async function getPlaceDetails(apiKey, { placeId, fields = 'name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,types' }) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}
