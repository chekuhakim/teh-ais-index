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
    const apiKey = process.env.MAPBOX_TOKEN;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Mapbox API key not configured' }),
      };
    }

    let result;

    switch (action) {
      case 'geocoding':
        result = await geocoding(apiKey, params);
        break;
      case 'reverse-geocoding':
        result = await reverseGeocoding(apiKey, params);
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
    console.error('Error in Mapbox function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function geocoding(apiKey, { query, country = 'MY', limit = 1 }) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${apiKey}&country=${country}&limit=${limit}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

async function reverseGeocoding(apiKey, { lng, lat }) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}
