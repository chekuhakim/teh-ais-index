export interface MapboxGeocodingResult {
  type: string;
  query: string[];
  features: Array<{
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: {
      wikidata?: string;
      mapbox_id?: string;
    };
    text: string;
    place_name: string;
    bbox?: number[];
    center: [number, number];
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    context?: Array<{
      id: string;
      mapbox_id: string;
      wikidata?: string;
      text: string;
      short_code?: string;
    }>;
  }>;
  attribution: string;
}

class MapboxServiceNetlify {
  private baseUrl: string;

  constructor() {
    // Use Netlify function URL in production, fallback to localhost in development
    this.baseUrl = import.meta.env.PROD 
      ? '/.netlify/functions/mapbox'
      : 'http://localhost:8888/.netlify/functions/mapbox';
  }

  private async callFunction(action: string, params: any) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error calling Mapbox function:', error);
      throw error;
    }
  }

  async geocoding(query: string, country: string = 'MY', limit: number = 1): Promise<MapboxGeocodingResult> {
    try {
      const data = await this.callFunction('geocoding', {
        query,
        country,
        limit,
      });

      return data;
    } catch (error) {
      console.error('Error in geocoding:', error);
      throw error;
    }
  }

  async reverseGeocoding(lng: number, lat: number): Promise<MapboxGeocodingResult> {
    try {
      const data = await this.callFunction('reverse-geocoding', {
        lng,
        lat,
      });

      return data;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  }

  async searchLocation(query: string): Promise<{ lat: number; lng: number; address: string } | null> {
    try {
      const result = await this.geocoding(query);
      
      if (result.features && result.features.length > 0) {
        const feature = result.features[0];
        return {
          lat: feature.center[1],
          lng: feature.center[0],
          address: feature.place_name,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  }
}

export const mapboxServiceNetlify = new MapboxServiceNetlify();
