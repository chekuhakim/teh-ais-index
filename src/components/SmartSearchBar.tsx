import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Plus, Edit3, X } from 'lucide-react';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import { RestaurantFromGoogle } from '@/types/restaurant';
import { useRestaurantsWithFallback } from '@/hooks/useRestaurantsWithFallback';
import { RestaurantService } from '@/services/restaurantService';
import { MamakRestaurant } from '@/types/restaurant';

interface SmartSearchBarProps {
  onRestaurantSelect?: (restaurant: MamakRestaurant) => void;
  onAddNewRestaurant?: (restaurant: RestaurantFromGoogle) => void;
  onUpdatePrice?: (restaurant: MamakRestaurant) => void;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onRestaurantSelect,
  onAddNewRestaurant,
  onUpdatePrice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<MamakRestaurant[]>([]);
  const [googleResults, setGoogleResults] = useState<RestaurantFromGoogle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showGoogleSearch, setShowGoogleSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { usingFallback } = useRestaurantsWithFallback();

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowGoogleSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setGoogleResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setSearchTerm(term);

    try {
      let results: MamakRestaurant[] = [];
      
      if (usingFallback) {
        // Use mock data for fallback
        const { mockRestaurants } = await import('@/data/mockRestaurants');
        results = mockRestaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(term.toLowerCase()) ||
          restaurant.specialties.some(specialty => 
            specialty.toLowerCase().includes(term.toLowerCase())
          )
        );
      } else {
        // Use Firebase search
        results = await RestaurantService.searchRestaurants(term);
      }
      
      if (results && results.length > 0) {
        // Found existing restaurants
        setSearchResults(results);
        setShowGoogleSearch(false);
        setShowResults(true);
      } else {
        // No existing restaurants found, show option to add new
        setSearchResults([]);
        setShowGoogleSearch(false);
        setShowResults(true);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowGoogleSearch(false);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const handleGoogleRestaurantSelect = (restaurant: RestaurantFromGoogle) => {
    setShowResults(false);
    setShowGoogleSearch(false);
    setSearchTerm('');
    onAddNewRestaurant?.(restaurant);
  };

  const handleExistingRestaurantSelect = (restaurant: MamakRestaurant) => {
    setShowResults(false);
    setSearchTerm('');
    onUpdatePrice?.(restaurant);
  };

  const handleAddNewClick = () => {
    setShowGoogleSearch(true);
    setShowResults(true);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center px-4 py-3">
          {/* Google Maps Logo */}
          <div className="flex items-center mr-3">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search mamak restaurants..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full text-gray-700 placeholder-gray-500 outline-none text-sm"
            />
          </div>
          
          {/* Search Icon */}
          <div className="flex items-center gap-2">
            {isSearching && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
            <Search className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {showGoogleSearch ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Search Google Places</h3>
                <button
                  onClick={() => setShowGoogleSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <GooglePlacesSearch
                onRestaurantSelect={handleGoogleRestaurantSelect}
              />
            </div>
          ) : (
            <div className="p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((restaurant) => (
                    <button
                      key={restaurant.id}
                      onClick={() => handleExistingRestaurantSelect(restaurant)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {restaurant.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {restaurant.address}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          RM {restaurant.tehAisPrice}
                        </p>
                      </div>
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    No existing restaurants found for "{searchTerm}"
                  </p>
                  <button
                    onClick={handleAddNewClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Restaurant
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
