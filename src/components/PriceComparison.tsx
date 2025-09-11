import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { MamakRestaurant } from '@/types/restaurant';

interface PriceComparisonProps {
  restaurants: MamakRestaurant[];
  onCollapse?: () => void;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({ restaurants, onCollapse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse when map is interacted with
  React.useEffect(() => {
    const handleMapInteraction = () => {
      if (isMobile && isExpanded) {
        setIsExpanded(false);
        onCollapse?.();
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
  }, [isMobile, isExpanded, onCollapse]);

  const restaurantsWithPrices = restaurants.filter(r => r.tehAisPrice !== null);
  const averagePrice = restaurantsWithPrices.length > 0 
    ? restaurantsWithPrices.reduce((sum, r) => sum + (r.tehAisPrice || 0), 0) / restaurantsWithPrices.length 
    : 0;

  const cheapest = restaurantsWithPrices.reduce((min, r) => 
    !min || (r.tehAisPrice || 0) < (min.tehAisPrice || 0) ? r : min, null as MamakRestaurant | null
  );

  const mostExpensive = restaurantsWithPrices.reduce((max, r) => 
    !max || (r.tehAisPrice || 0) > (max.tehAisPrice || 0) ? r : max, null as MamakRestaurant | null
  );

  const getPriceColorClass = (price: number) => {
    if (price <= 1.80) return 'text-green-600';
    if (price <= 2.00) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-72 sm:w-80 bg-gradient-card shadow-card border-0 max-h-80 sm:max-h-96 overflow-hidden">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-lg font-bold flex items-center gap-2">
            <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-teh" />
            <span className="hidden sm:inline">Teh Ais Prices</span>
            <span className="sm:hidden">Prices</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </CardHeader>

      {/* Show content only when expanded on mobile, always show on desktop */}
      {(!isMobile || isExpanded) && (
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-xs text-muted-foreground mb-1">Average</div>
              <div className="font-bold text-lg">
                RM {averagePrice.toFixed(2)}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-xs text-muted-foreground mb-1">Range</div>
              <div className="font-bold text-lg">
                {restaurantsWithPrices.length > 1 
                  ? `RM ${((mostExpensive?.tehAisPrice || 0) - (cheapest?.tehAisPrice || 0)).toFixed(2)}`
                  : 'N/A'
                }
              </div>
            </div>
          </div>

          {/* Best & Worst Deals */}
          {cheapest && mostExpensive && restaurantsWithPrices.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{cheapest.name}</div>
                  <div className="text-green-600 font-bold">RM {cheapest.tehAisPrice?.toFixed(2)}</div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  Cheapest
                </Badge>
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{mostExpensive.name}</div>
                  <div className="text-red-600 font-bold">RM {mostExpensive.tehAisPrice?.toFixed(2)}</div>
                </div>
                <Badge variant="destructive">
                  Priciest
                </Badge>
              </div>
            </div>
          )}

          {/* Detailed List - Only show when expanded */}
          {isExpanded && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium text-sm text-muted-foreground">All Restaurants</h4>
              {restaurantsWithPrices.map((restaurant, index) => (
                <div key={restaurant.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{restaurant.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {restaurant.isOpen ? 'Open now' : 'Closed'}
                    </div>
                  </div>
                  <div className={`font-bold ${getPriceColorClass(restaurant.tehAisPrice || 0)}`}>
                    RM {restaurant.tehAisPrice?.toFixed(2)}
                  </div>
                </div>
              ))}
              
              {restaurants.filter(r => r.tehAisPrice === null).length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-2">No price data:</div>
                  {restaurants
                    .filter(r => r.tehAisPrice === null)
                    .map(restaurant => (
                      <div key={restaurant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate">{restaurant.name}</span>
                        <Badge variant="outline">Add price</Badge>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground px-2">
            <span className="hidden sm:inline">{restaurantsWithPrices.length} of {restaurants.length} restaurants have price data</span>
            <span className="sm:hidden">{restaurantsWithPrices.length}/{restaurants.length} have prices</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};