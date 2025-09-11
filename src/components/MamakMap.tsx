import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MamakRestaurant } from '@/types/restaurant';
import { useRestaurantsWithFallback } from '@/hooks/useRestaurantsWithFallback';
import { useAuth } from '@/hooks/useAuth';
import { getContributorDisplayName } from '@/lib/contributorUtils';
import { RestaurantCard } from './RestaurantCard';
import { PriceComparison } from './PriceComparison';

// Mapbox access token - will be loaded from Netlify function
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2hla3VoYWtpbSIsImEiOiJjbWZldWl0ODMwYWYxMmxyMTBsNjRycTUxIn0.bVf63UP9C8XWJHFvFS5EEg';

interface MamakMapProps {
  onLoginRequest?: () => void;
}

export const MamakMap: React.FC<MamakMapProps> = ({ onLoginRequest }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<MamakRestaurant | null>(null);
  const { restaurants, loading, error, usingFallback, updateRestaurantPrice } = useRestaurantsWithFallback();
  const { user, userProfile, incrementContribution } = useAuth();

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, we'll show a message about Mapbox token
    if (MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
      console.warn('Please add your Mapbox token to see the interactive map');
    }

    // Initialize map (will show error without proper token, but structure is ready)
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [101.6869, 3.1390], // Kuala Lumpur center
        zoom: 11,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for restaurants
      restaurants.forEach((restaurant) => {
        const markerElement = createCustomMarker(restaurant);
        
        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat([restaurant.coordinates.lng, restaurant.coordinates.lat])
          .addTo(map.current!);
        
        markersRef.current.push(marker);

        // Add click handler
        markerElement.addEventListener('click', () => {
          setSelectedRestaurant(restaurant);
        });
      });

    } catch (error) {
      console.log('Map initialization requires valid Mapbox token');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [restaurants]);

  const createCustomMarker = (restaurant: MamakRestaurant) => {
    const el = document.createElement('div');
    el.className = 'mamak-marker';
    
    const priceColor = restaurant.tehAisPrice 
      ? restaurant.tehAisPrice <= 1.80 ? 'bg-green-500' 
        : restaurant.tehAisPrice <= 2.00 ? 'bg-yellow-500' 
        : 'bg-red-500'
      : 'bg-gray-400';
    
    el.innerHTML = `
      <div class="relative cursor-pointer transform transition-transform hover:scale-110">
        <div class="w-8 h-8 ${priceColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span class="text-white text-xs font-bold">RM</span>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        ${restaurant.tehAisPrice ? `
          <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            RM ${restaurant.tehAisPrice.toFixed(2)}
          </div>
        ` : ''}
      </div>
    `;
    
    return el;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-card text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-bold mb-2 text-primary">Loading Restaurants</h3>
          <p className="text-muted-foreground mb-4">Connecting to Firebase...</p>
          <div className="text-sm text-muted-foreground">
            <p>If this takes too long, the app will use sample data.</p>
            <p className="mt-2">Check browser console for details.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-card text-center max-w-md">
          <h3 className="text-xl font-bold mb-4 text-destructive">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-background to-muted">
      {/* Fallback Data Notice */}
      {usingFallback && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm">
          <strong>⚠️ Using Sample Data:</strong> Firebase not configured. 
          <a 
            href="https://console.firebase.google.com/project/mamak-a7768" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline ml-1"
          >
            Set up Firebase
          </a> to save data permanently.
        </div>
      )}
      
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay for Mapbox token message */}
      {MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE' && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg shadow-card max-w-md text-center">
            <h3 className="text-xl font-bold mb-4 text-primary">Mapbox Setup Required</h3>
            <p className="text-muted-foreground mb-4">
              To see the interactive map, please add your Mapbox public token. 
              Visit <a href="https://mapbox.com" className="text-accent underline">mapbox.com</a> to get your free token.
            </p>
            <div className="bg-muted p-4 rounded-md text-sm text-left font-mono">
              <p>// In MamakMap.tsx, replace:</p>
              <p className="text-primary">const MAPBOX_TOKEN = 'your_actual_token_here';</p>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Card Overlay */}
      {selectedRestaurant && (
        <div className="absolute top-4 left-4 z-10">
          <RestaurantCard 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)}
            onUpdatePrice={async (price) => {
              if (!user) {
                alert('Please log in to update restaurant prices');
                return;
              }
              try {
                const contributorLevel = userProfile?.contributorLevel || 'newbie';
                const showEmail = userProfile?.showEmail || false;
                const displayName = getContributorDisplayName(contributorLevel, showEmail, user.email || undefined);
                
                await updateRestaurantPrice(
                  selectedRestaurant.id, 
                  price, 
                  user.uid, 
                  displayName,
                  contributorLevel,
                  showEmail
                );
                
                // Increment user contribution count
                if (userProfile) {
                  await incrementContribution();
                }
                
                console.log(`Updated price for ${selectedRestaurant.name}: RM ${price}`);
              } catch (error) {
                console.error('Failed to update price:', error);
              }
            }}
            onLoginRequest={onLoginRequest}
          />
        </div>
      )}

      {/* Price Comparison Sidebar */}
      <div className="absolute top-4 right-4 z-10">
        <PriceComparison restaurants={restaurants} />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card p-4 rounded-lg shadow-card">
        <h4 className="font-semibold mb-3 text-card-foreground">Price Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>≤ RM 1.80 (Cheap)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>RM 1.81 - 2.00 (Moderate)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>&gt; RM 2.00 (Expensive)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span>No price data</span>
          </div>
        </div>
      </div>
    </div>
  );
};