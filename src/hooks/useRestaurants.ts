import { useState, useEffect, useCallback } from 'react';
import { RestaurantService } from '@/services/restaurantService';
import { MamakRestaurant, PriceEntry } from '@/types/restaurant';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<MamakRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Starting to fetch restaurants from Firebase...');
      const startTime = Date.now();
      
      const data = await RestaurantService.getAllRestaurants();
      
      const endTime = Date.now();
      console.log(`✅ Successfully fetched ${data.length} restaurants in ${endTime - startTime}ms`);
      console.log('Restaurants data:', data);
      
      setRestaurants(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch restaurants';
      console.error('❌ Error fetching restaurants:', err);
      setError(errorMessage);
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
      setError(err instanceof Error ? err.message : 'Failed to update price');
      throw err;
    }
  }, []);

  const addRestaurant = useCallback(async (restaurant: Omit<MamakRestaurant, 'id'>) => {
    try {
      const id = await RestaurantService.addRestaurant(restaurant);
      const newRestaurant = { ...restaurant, id };
      setRestaurants(prev => [...prev, newRestaurant]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add restaurant');
      throw err;
    }
  }, []);

  const searchRestaurants = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await RestaurantService.searchRestaurants(searchTerm);
      setRestaurants(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRestaurantsByPriceRange = useCallback(async (minPrice: number, maxPrice: number) => {
    try {
      setLoading(true);
      const results = await RestaurantService.getRestaurantsByPriceRange(minPrice, maxPrice);
      setRestaurants(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter restaurants by price');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRestaurantPrices = useCallback(async (
    restaurantId: string,
    priceUpdates: {
      tehAisPrice?: number | null;
      rotiCanaiPrice?: number | null;
      meeGorengPrice?: number | null;
      nasiLemakPrice?: number | null;
      tehTarikPrice?: number | null;
      nasiKandarPrice?: number | null;
      rotiTelurPrice?: number | null;
    },
    userId?: string,
    username?: string,
    contributorLevel?: string,
    showEmail?: boolean
  ) => {
    try {
      await RestaurantService.updateRestaurantPrices(
        restaurantId, 
        priceUpdates, 
        userId, 
        username, 
        contributorLevel, 
        showEmail
      );
      
      // Update local state
      setRestaurants(prev => prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { 
              ...restaurant, 
              ...priceUpdates,
              lastUpdated: new Date().toISOString(),
              lastUpdatedBy: username || 'Anonymous',
              lastUpdatedByLevel: contributorLevel as any || 'newbie'
            }
          : restaurant
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update restaurant prices');
      throw err;
    }
  }, []);

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    updateRestaurantPrice,
    updateRestaurantPrices,
    addRestaurant,
    searchRestaurants,
    getRestaurantsByPriceRange
  };
};

export const useRestaurant = (id: string) => {
  const [restaurant, setRestaurant] = useState<MamakRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RestaurantService.getRestaurantById(id);
      setRestaurant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant');
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id, fetchRestaurant]);

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant
  };
};

export const usePriceHistory = (restaurantId: string) => {
  const [priceHistory, setPriceHistory] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RestaurantService.getPriceHistory(restaurantId);
      setPriceHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history');
      console.error('Error fetching price history:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      fetchPriceHistory();
    }
  }, [restaurantId, fetchPriceHistory]);

  return {
    priceHistory,
    loading,
    error,
    refetch: fetchPriceHistory
  };
};
