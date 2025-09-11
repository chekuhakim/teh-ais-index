import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
    }
  };

  const trackRestaurantView = (restaurantId: string, restaurantName: string) => {
    trackEvent('restaurant_view', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName
    });
  };

  const trackPriceUpdate = (restaurantId: string, oldPrice: number | null, newPrice: number) => {
    trackEvent('price_update', {
      restaurant_id: restaurantId,
      old_price: oldPrice,
      new_price: newPrice,
      price_change: oldPrice ? newPrice - oldPrice : null
    });
  };

  const trackSearch = (searchTerm: string, resultCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount
    });
  };

  const trackMapInteraction = (interactionType: 'zoom' | 'pan' | 'marker_click') => {
    trackEvent('map_interaction', {
      interaction_type: interactionType
    });
  };

  const trackUserAction = (action: 'sign_in' | 'sign_up' | 'sign_out', method?: string) => {
    trackEvent('user_action', {
      action,
      method: method || 'email'
    });
  };

  return {
    trackEvent,
    trackRestaurantView,
    trackPriceUpdate,
    trackSearch,
    trackMapInteraction,
    trackUserAction
  };
};
