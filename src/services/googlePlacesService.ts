import { Loader } from '@googlemaps/js-api-loader';

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Validate Google Places API key
if (!GOOGLE_PLACES_API_KEY) {
  console.error('Missing required Google Places API key environment variable: VITE_GOOGLE_PLACES_API_KEY');
  throw new Error('Missing required Google Places API key environment variable: VITE_GOOGLE_PLACES_API_KEY');
}

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

class GooglePlacesService {
  private loader: Loader | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;

  async initialize() {
    if (this.loader) return;

    this.loader = new Loader({
      apiKey: GOOGLE_PLACES_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });

    try {
      await this.loader.load();
      
      // Create a dummy div for PlacesService (required by Google Maps API)
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv);
      
      this.placesService = new google.maps.places.PlacesService(map);
      this.autocompleteService = new google.maps.places.AutocompleteService();
    } catch (error) {
      console.error('Failed to load Google Maps API:', error);
      throw error;
    }
  }

  async searchRestaurants(query: string, location?: { lat: number; lng: number }): Promise<GooglePlaceResult[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request: google.maps.places.PlaceSearchRequest = {
        query: query,
        type: 'restaurant',
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'types',
          'photos',
          'price_level',
          'vicinity'
        ]
      };

      if (location) {
        request.location = new google.maps.LatLng(location.lat, location.lng);
        request.radius = 50000; // 50km radius
      }

      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results as GooglePlaceResult[]);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async searchNearbyMamak(lat: number, lng: number): Promise<RestaurantFromGoogle[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request: google.maps.places.PlaceSearchRequest = {
        query: 'mamak restaurant',
        type: 'restaurant',
        location: new google.maps.LatLng(lat, lng),
        radius: 5000, // 5km radius for nearby search
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'types',
          'photos',
          'price_level',
          'vicinity'
        ]
      };

      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter for mamak-related restaurants
          const mamakResults = results.filter(place => {
            const name = place.name?.toLowerCase() || '';
            const types = place.types || [];
            return (
              name.includes('mamak') ||
              name.includes('nasi kandar') ||
              name.includes('roti canai') ||
              types.includes('meal_takeaway') ||
              types.includes('restaurant')
            );
          });

          // Limit to 5 results and convert to RestaurantFromGoogle format
          const limitedResults = mamakResults.slice(0, 5);
          const restaurants = limitedResults.map(place => this.convertGooglePlaceToRestaurant(place));
          resolve(restaurants);
        } else {
          reject(new Error(`Nearby mamak search failed: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'types',
          'photos',
          'price_level',
          'vicinity',
          'website',
          'formatted_phone_number',
          'reviews'
        ]
      };

      this.placesService!.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }

  async getAutocompleteSuggestions(input: string, location?: { lat: number; lng: number }): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.autocompleteService) {
        reject(new Error('Autocomplete service not initialized'));
        return;
      }

      const request: google.maps.places.AutocompleteRequest = {
        input: input,
        types: ['establishment'],
        componentRestrictions: { country: 'my' } // Restrict to Malaysia
      };

      if (location) {
        request.location = new google.maps.LatLng(location.lat, location.lng);
        request.radius = 50000;
      }

      this.autocompleteService!.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions);
        } else {
          resolve([]); // Return empty array instead of rejecting
        }
      });
    });
  }

  convertGooglePlaceToRestaurant(place: GooglePlaceResult | google.maps.places.PlaceResult): RestaurantFromGoogle {
    const getOpeningHours = (openingHours?: google.maps.places.PlaceOpeningHours) => {
      if (!openingHours || !openingHours.weekday_text) {
        return 'Hours not available';
      }
      
      // Check if it's 24/7
      const is24Hours = openingHours.weekday_text.every(day => 
        day.toLowerCase().includes('24 hours') || 
        day.toLowerCase().includes('open 24 hours')
      );
      
      if (is24Hours) {
        return '24 Hours';
      }
      
      // Return first day's hours as example
      return openingHours.weekday_text[0] || 'Hours not available';
    };

    const getSpecialties = (types: string[]): string[] => {
      const foodTypes = types.filter(type => 
        type.includes('food') || 
        type.includes('restaurant') ||
        type.includes('meal') ||
        type.includes('cafe')
      );
      
      // Map Google types to common specialties
      const specialtyMap: { [key: string]: string } = {
        'meal_takeaway': 'Takeaway',
        'meal_delivery': 'Delivery',
        'cafe': 'Coffee & Tea',
        'bakery': 'Bakery',
        'fast_food_restaurant': 'Fast Food',
        'indian_restaurant': 'Indian Cuisine',
        'malay_restaurant': 'Malay Cuisine',
        'chinese_restaurant': 'Chinese Cuisine'
      };
      
      const specialties = foodTypes.map(type => specialtyMap[type] || type.replace(/_/g, ' '));
      
      // Add common mamak specialties if it's a restaurant
      if (types.includes('restaurant') || types.includes('food')) {
        return ['Teh Ais Bungkus Ikat Tepi', 'Roti Canai', 'Mee Goreng', ...specialties].slice(0, 5);
      }
      
      return specialties.slice(0, 5);
    };

    return {
      name: place.name || 'Unknown Restaurant',
      address: place.formatted_address || place.vicinity || 'Address not available',
      coordinates: {
        lat: place.geometry?.location?.lat() || place.geometry?.location?.lat || 0,
        lng: place.geometry?.location?.lng() || place.geometry?.location?.lng || 0
      },
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      isOpen: place.opening_hours?.open_now || false,
      openHours: getOpeningHours(place.opening_hours),
      specialties: getSpecialties(place.types || []),
      placeId: place.place_id || '',
      priceLevel: place.price_level,
      photoReference: place.photos?.[0]?.photo_reference
    };
  }
}

export const googlePlacesService = new GooglePlacesService();
