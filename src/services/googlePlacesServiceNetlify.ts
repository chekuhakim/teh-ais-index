export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  types: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
  vicinity?: string;
}

export interface RestaurantFromGoogle {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openHours: string;
  specialties: string[];
  placeId: string;
  priceLevel?: number;
  photoReference?: string;
}

class GooglePlacesServiceNetlify {
  private baseUrl: string;

  constructor() {
    // Use Netlify function URL in production, fallback to localhost in development
    this.baseUrl = import.meta.env.PROD 
      ? '/.netlify/functions/google-places'
      : 'http://localhost:8888/.netlify/functions/google-places';
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
      console.error('Error calling Google Places function:', error);
      throw error;
    }
  }

  async searchPlaces(query: string, location: { lat: number; lng: number }, radius: number = 5000): Promise<GooglePlaceResult[]> {
    try {
      const data = await this.callFunction('search', {
        query,
        location,
        radius,
      });

      return data.results || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async searchNearbyMamak(location: { lat: number; lng: number }, radius: number = 5000): Promise<GooglePlaceResult[]> {
    try {
      const data = await this.callFunction('nearby', {
        location,
        radius,
        type: 'restaurant',
      });

      // Filter for mamak-related restaurants
      const mamakKeywords = ['mamak', 'nasi kandar', 'roti canai', 'teh tarik', 'indian', 'malay'];
      const results = data.results || [];
      
      return results.filter(place => {
        const name = place.name?.toLowerCase() || '';
        const types = place.types || [];
        
        return mamakKeywords.some(keyword => 
          name.includes(keyword) || 
          types.some(type => type.includes('restaurant'))
        );
      }).slice(0, 5); // Limit to 5 results
    } catch (error) {
      console.error('Error searching nearby mamak:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    try {
      const data = await this.callFunction('details', {
        placeId,
        fields: 'name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,types,photos',
      });

      return data.result || null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  convertToRestaurant(place: GooglePlaceResult): RestaurantFromGoogle {
    const specialties = this.extractSpecialties(place);
    
    return {
      name: place.name,
      address: place.formatted_address || place.vicinity || 'Address not available',
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      isOpen: place.opening_hours?.open_now || false,
      openHours: place.opening_hours?.weekday_text?.[0] || 'Hours not available',
      specialties,
      placeId: place.place_id,
      priceLevel: place.price_level,
      photoReference: place.photos?.[0]?.photo_reference,
    };
  }

  private extractSpecialties(place: GooglePlaceResult): string[] {
    const specialties: string[] = [];
    
    // Common mamak specialties
    const commonSpecialties = [
      'Teh Ais', 'Roti Canai', 'Mee Goreng', 'Nasi Lemak', 
      'Teh Tarik', 'Nasi Kandar', 'Roti Telur', 'Mamak'
    ];

    // Add common specialties for mamak restaurants
    specialties.push(...commonSpecialties);

    // Add specialties based on place types
    if (place.types) {
      if (place.types.includes('restaurant')) {
        specialties.push('Restaurant');
      }
      if (place.types.includes('food')) {
        specialties.push('Food');
      }
    }

    return [...new Set(specialties)]; // Remove duplicates
  }

  async searchAndConvertPlaces(query: string, location: { lat: number; lng: number }): Promise<RestaurantFromGoogle[]> {
    try {
      const places = await this.searchPlaces(query, location);
      return places.map(place => this.convertToRestaurant(place));
    } catch (error) {
      console.error('Error searching and converting places:', error);
      return [];
    }
  }

  async searchNearbyMamakAndConvert(location: { lat: number; lng: number }): Promise<RestaurantFromGoogle[]> {
    try {
      const places = await this.searchNearbyMamak(location);
      return places.map(place => this.convertToRestaurant(place));
    } catch (error) {
      console.error('Error searching nearby mamak and converting:', error);
      return [];
    }
  }
}

export const googlePlacesServiceNetlify = new GooglePlacesServiceNetlify();
