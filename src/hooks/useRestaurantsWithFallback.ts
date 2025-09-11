import { useState, useEffect, useCallback } from 'react';
import { RestaurantService } from '@/services/restaurantService';
import { MamakRestaurant } from '@/types/restaurant';
import { mockRestaurants } from '@/data/mockRestaurants';

export const useRestaurantsWithFallback = () => {
  const [restaurants, setRestaurants] = useState<MamakRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      console.log('🔄 Attempting to fetch restaurants from Firebase...');
      const startTime = Date.now();
      
      // Set a timeout for Firebase request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Firebase request timeout')), 10000); // 10 second timeout
      });
      
      const dataPromise = RestaurantService.getAllRestaurants();
      const data = await Promise.race([dataPromise, timeoutPromise]);
      
      const endTime = Date.now();
      console.log(`✅ Successfully fetched ${data.length} restaurants from Firebase in ${endTime - startTime}ms`);
      
      if (data.length === 0) {
        console.log('⚠️ No restaurants found in Firebase, using mock data as fallback');
        setRestaurants(mockRestaurants);
        setUsingFallback(true);
      } else {
        setRestaurants(data);
        setUsingFallback(false);
      }
    } catch (err) {
      console.warn('❌ Firebase fetch failed, using mock data as fallback:', err);
      setRestaurants(mockRestaurants);
      setUsingFallback(true);
      setError(`Firebase unavailable: ${err instanceof Error ? err.message : 'Unknown error'}. Using sample data.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const updateRestaurantPrice = useCallback(async (
    restaurantId: string, 
    price: number, 
    userId?: string, 
    username?: string,
    contributorLevel?: string,
    showEmail?: boolean
  ) => {
    if (usingFallback) {
      console.warn('⚠️ Cannot update price: Using fallback data. Please set up Firebase first.');
      return;
    }

    try {
      await RestaurantService.updateRestaurantPrice(restaurantId, price, userId, username, contributorLevel, showEmail);
      
      // Update local state
      setRestaurants(prev => prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { 
              ...restaurant, 
              tehAisPrice: price, 
              lastUpdated: new Date().toISOString(),
              lastUpdatedBy: username || 'Anonymous',
              lastUpdatedByLevel: contributorLevel as any || 'newbie'
            }
          : restaurant
      ));
    } catch (err) {
      console.error('Failed to update price:', err);
      throw err;
    }
  }, [usingFallback]);

  const addRestaurant = useCallback(async (restaurant: Omit<MamakRestaurant, 'id'>) => {
    if (usingFallback) {
      console.warn('⚠️ Cannot add restaurant: Using fallback data. Please set up Firebase first.');
      throw new Error('Cannot add restaurant: Firebase not available. Please set up Firebase first.');
    }

    try {
      const id = await RestaurantService.addRestaurant(restaurant);
      const newRestaurant = { ...restaurant, id };
      setRestaurants(prev => [...prev, newRestaurant]);
      return id;
    } catch (err) {
      console.error('Failed to add restaurant:', err);
      throw err;
    }
  }, [usingFallback]);

  const searchRestaurants = useCallback(async (searchTerm: string) => {
    if (usingFallback) {
      // Simple client-side search for fallback data
      const results = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setRestaurants(results);
      return;
    }

    try {
      setLoading(true);
      const results = await RestaurantService.searchRestaurants(searchTerm);
      setRestaurants(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to search restaurants');
    } finally {
      setLoading(false);
    }
  }, [usingFallback]);

  const getRestaurantsByPriceRange = useCallback(async (minPrice: number, maxPrice: number) => {
    if (usingFallback) {
      // Simple client-side filtering for fallback data
      const results = mockRestaurants.filter(restaurant => 
        restaurant.tehAisPrice !== null && 
        restaurant.tehAisPrice >= minPrice && 
        restaurant.tehAisPrice <= maxPrice
      );
      setRestaurants(results);
      return;
    }

    try {
      setLoading(true);
      const results = await RestaurantService.getRestaurantsByPriceRange(minPrice, maxPrice);
      setRestaurants(results);
    } catch (err) {
      console.error('Price range filter failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to filter restaurants by price');
    } finally {
      setLoading(false);
    }
  }, [usingFallback]);

  return {
    restaurants,
    loading,
    error,
    usingFallback,
    fetchRestaurants,
    updateRestaurantPrice,
    addRestaurant,
    searchRestaurants,
    getRestaurantsByPriceRange
  };
};
