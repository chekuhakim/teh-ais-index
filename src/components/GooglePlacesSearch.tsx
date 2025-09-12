import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Clock, DollarSign, Loader2, Navigation } from 'lucide-react';
import { googlePlacesServiceNetlify, RestaurantFromGoogle } from '@/services/googlePlacesServiceNetlify';

interface GooglePlacesSearchProps {
  onRestaurantSelect: (restaurant: RestaurantFromGoogle) => void;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  onRestaurantSelect,
  onLocationChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [searchResults, setSearchResults] = useState<RestaurantFromGoogle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantFromGoogle | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          onLocationChange?.(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Could not get current location:', error);
          // Default to Kuala Lumpur
          const defaultLocation = { lat: 3.1390, lng: 101.6869 };
          setCurrentLocation(defaultLocation);
          onLocationChange?.(defaultLocation.lat, defaultLocation.lng);
        }
      );
    } else {
      // Default to Kuala Lumpur
      const defaultLocation = { lat: 3.1390, lng: 101.6869 };
      setCurrentLocation(defaultLocation);
      onLocationChange?.(defaultLocation.lat, defaultLocation.lng);
    }
  }, [onLocationChange]);

  // Handle autocomplete suggestions
  const handleInputChange = async (value: string) => {
    setSearchQuery(value);
    setError(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const predictions = await googlePlacesService.getAutocompleteSuggestions(value, currentLocation || undefined);
        setSuggestions(predictions);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const restaurants = await googlePlacesServiceNetlify.searchAndConvertPlaces(searchQuery, currentLocation || { lat: 3.1390, lng: 101.6869 });
      setSearchResults(restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search restaurants');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle GPS-based nearby mamak search
  const handleFindNearbyMamak = async () => {
    if (!currentLocation) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    
    try {
      // Search for mamak restaurants near current location
      const results = await googlePlacesServiceNetlify.searchNearbyMamakAndConvert(currentLocation);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find nearby mamak restaurants');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
    
    try {
      setIsLoading(true);
      const placeDetails = await googlePlacesService.getPlaceDetails(suggestion.place_id);
      if (placeDetails) {
        const restaurant = googlePlacesService.convertGooglePlaceToRestaurant(placeDetails);
        onRestaurantSelect(restaurant);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get place details');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle restaurant selection from search results
  const handleRestaurantSelect = (restaurant: RestaurantFromGoogle) => {
    console.log('Restaurant selected:', restaurant);
    setSelectedRestaurant(restaurant);
    onRestaurantSelect(restaurant);
    setSearchResults([]);
    setSearchQuery('');
  };

  const getPriceLevelText = (priceLevel?: number) => {
    if (!priceLevel) return 'Price not available';
    const levels = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    return levels[priceLevel] || 'Price not available';
  };

  const getPriceLevelColor = (priceLevel?: number) => {
    if (!priceLevel) return 'bg-gray-100';
    const colors = ['bg-green-100', 'bg-yellow-100', 'bg-orange-100', 'bg-red-100', 'bg-purple-100'];
    return colors[priceLevel] || 'bg-gray-100';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Restaurants with Google Places
          </CardTitle>
          <CardDescription>
            Search for restaurants by name or find nearby mamak places using your GPS location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant-search">Restaurant Name</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="restaurant-search"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Restoran Pelita, Mamak Corner, Nasi Kandar"
                className="pr-10"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
            </div>
            
            {/* Autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.structured_formatting?.main_text}</div>
                    <div className="text-sm text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !searchQuery.trim()}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Restaurants
              </>
            )}
          </Button>

          {/* GPS-based nearby mamak search */}
          <Button
            onClick={handleFindNearbyMamak}
            disabled={isSearching || !currentLocation}
            variant="outline"
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Nearby Mamak...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Find Nearby Mamak Places
              </>
            )}
          </Button>

          {!currentLocation && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Location services are required to find nearby mamak restaurants. 
                Please enable location access in your browser.
              </AlertDescription>
            </Alert>
          )}

          {selectedRestaurant && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                ✅ Selected: <strong>{selectedRestaurant.name}</strong> - Restaurant added successfully!
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="max-h-96 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Click on a restaurant to add it to your database
              {searchResults.length === 5 && (
                <span className="block text-sm text-muted-foreground mt-1">
                  Showing 5 nearby mamak restaurants
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-80">
            <div className="space-y-3">
              {searchResults.map((restaurant, index) => (
                <div
                  key={`${restaurant.placeId}-${index}`}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-base pr-2 break-words">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {restaurant.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{restaurant.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                        </div>
                      )}
                      {restaurant.priceLevel && (
                        <Badge variant="secondary" className={`text-xs ${getPriceLevelColor(restaurant.priceLevel)}`}>
                          <DollarSign className="h-2 w-2 mr-1" />
                          {getPriceLevelText(restaurant.priceLevel)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{restaurant.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span className="truncate">{restaurant.openHours}</span>
                    <Badge variant={restaurant.isOpen ? "default" : "secondary"} className="text-xs">
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
