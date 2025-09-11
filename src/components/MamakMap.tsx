import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MamakRestaurant } from '@/types/restaurant';
import { useRestaurantsWithFallback } from '@/hooks/useRestaurantsWithFallback';
import { useAuth } from '@/hooks/useAuth';
import { getContributorDisplayName } from '@/lib/contributorUtils';
import { RestaurantCard } from './RestaurantCard';

// Mapbox access token - loaded from environment variables only
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Validate Mapbox token
if (!MAPBOX_TOKEN) {
  console.error('Missing required Mapbox token environment variable: VITE_MAPBOX_TOKEN');
  throw new Error('Missing required Mapbox token environment variable: VITE_MAPBOX_TOKEN');
}

interface MamakMapProps {
  onLoginRequest?: () => void;
}

export const MamakMap: React.FC<MamakMapProps> = ({ onLoginRequest }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<MamakRestaurant | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { restaurants, loading, error, usingFallback, updateRestaurantPrice } = useRestaurantsWithFallback();
  const { user, userProfile, incrementContribution } = useAuth();

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Add current location marker to map
        if (map.current) {
          addCurrentLocationMarker(latitude, longitude);
          
          // Center map on current location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 2000
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please check your browser permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Add current location marker
  const addCurrentLocationMarker = (lat: number, lng: number) => {
    // Remove existing current location marker
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.remove();
    }

    // Create custom marker for current location
    const markerElement = document.createElement('div');
    markerElement.className = 'current-location-marker';
    markerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      position: relative;
    `;

    // Add pulsing animation
    const pulseElement = document.createElement('div');
    pulseElement.style.cssText = `
      position: absolute;
      top: -8px;
      left: -8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    `;
    markerElement.appendChild(pulseElement);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 1; }
        70% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1.4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Create marker
    const marker = new mapboxgl.Marker({ element: markerElement })
      .setLngLat([lng, lat])
      .addTo(map.current!);

    currentLocationMarkerRef.current = marker;

    // Add click handler to show location info
    markerElement.addEventListener('click', () => {
      // You could show a popup or do something when current location is clicked
      console.log('Current location clicked:', { lat, lng });
    });
  };

  // Auto-close restaurant modal on map interaction
  useEffect(() => {
    const handleMapInteraction = () => {
      if (selectedRestaurant) {
        setSelectedRestaurant(null);
      }
    };

    const mapContainer = document.querySelector('.mapboxgl-map');
    if (mapContainer) {
      mapContainer.addEventListener('wheel', handleMapInteraction);
      mapContainer.addEventListener('touchstart', handleMapInteraction);
      mapContainer.addEventListener('mousedown', handleMapInteraction);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('wheel', handleMapInteraction);
        mapContainer.removeEventListener('touchstart', handleMapInteraction);
        mapContainer.removeEventListener('mousedown', handleMapInteraction);
      }
    };
  }, [selectedRestaurant]);

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
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.remove();
      }
      map.current?.remove();
    };
  }, [restaurants]);

  const createCustomMarker = (restaurant: MamakRestaurant) => {
    const el = document.createElement('div');
    el.className = 'mamak-marker';
    
    const priceColor = restaurant.tehAisPrice 
      ? restaurant.tehAisPrice < 2.50 ? 'bg-green-500' 
        : restaurant.tehAisPrice <= 3.50 ? 'bg-yellow-500' 
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
            <p>If this takes too long, please check your internet connection.</p>
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
          <strong>⚠️ No Data Available:</strong> Firebase not configured. 
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
      
      {/* Current Location Button - Bottom Right */}
      <div className="absolute bottom-16 right-4 z-50">
        <button
          onClick={getCurrentLocation}
          className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border-2 border-blue-500 transition-colors"
          title="Show my current location"
        >
          <svg 
            className="w-6 h-6 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Location Error Message - Positioned above the location button */}
      {locationError && (
        <div className="absolute bottom-28 right-4 z-50 max-w-xs">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium">Location Error</p>
                <p className="text-xs mt-1">{locationError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

      {/* Restaurant Card Overlay - Centered */}
      {selectedRestaurant && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={() => setSelectedRestaurant(null)}
        >
        <div 
          className="relative max-w-sm w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Close button for the modal overlay */}
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
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
        </div>
      )}


    </div>
  );
};