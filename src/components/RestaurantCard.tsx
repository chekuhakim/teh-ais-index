import React, { useState } from 'react';
import { MamakRestaurant, ContributorLevel } from '@/types/restaurant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Clock, Star, MapPin, Coffee, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getContributorDisplayName, getContributorInfo } from '@/lib/contributorUtils';

interface RestaurantCardProps {
  restaurant: MamakRestaurant;
  onClose: () => void;
  onUpdatePrice: (price: number) => void;
  onLoginRequest?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClose,
  onUpdatePrice,
  onLoginRequest,
}) => {
  const [priceInput, setPriceInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const handlePriceUpdate = () => {
    const price = parseFloat(priceInput);
    if (price > 0) {
      setIsUpdating(true);
      onUpdatePrice(price);
      setPriceInput('');
      setTimeout(() => setIsUpdating(false), 1000);
    }
  };

  const getPriceStatus = (price: number | null) => {
    if (!price) return { label: 'No price', color: 'bg-gray-100 text-gray-600' };
    if (price <= 1.80) return { label: 'Cheap', color: 'bg-green-100 text-green-800' };
    if (price <= 2.00) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Expensive', color: 'bg-red-100 text-red-800' };
  };

  const priceStatus = getPriceStatus(restaurant.tehAisPrice);

  return (
    <Card className="w-80 max-w-sm bg-gradient-card shadow-card border-0 max-h-[85vh] overflow-y-auto flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-card-foreground pr-2">
            {restaurant.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{restaurant.address}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-gold fill-current" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="text-muted-foreground">({restaurant.reviewCount})</span>
          </div>
          
          <Badge 
            variant={restaurant.isOpen ? "default" : "secondary"}
            className={restaurant.isOpen ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <Clock className="h-3 w-3 mr-1" />
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-y-auto">
        {/* Current Price Display */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-teh" />
              <span className="font-medium">Teh Ais Price</span>
            </div>
            <div className="flex items-center gap-2">
              {restaurant.tehAisPrice ? (
                <>
                  <span className="text-xl font-bold text-primary">
                    RM {restaurant.tehAisPrice.toFixed(2)}
                  </span>
                  <Badge className={priceStatus.color}>
                    {priceStatus.label}
                  </Badge>
                </>
              ) : (
                <Badge className={priceStatus.color}>
                  {priceStatus.label}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Last Updated Info */}
          {restaurant.lastUpdated && (
            <div className="text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-1">
                <span>Last updated:</span>
                <span className="font-medium">
                  {(() => {
                    try {
                      const date = new Date(restaurant.lastUpdated);
                      if (isNaN(date.getTime())) {
                        return 'Recently';
                      }
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } catch {
                      return 'Recently';
                    }
                  })()}
                </span>
                {restaurant.lastUpdatedBy && (
                  <span className="flex items-center gap-1">
                    by {getContributorDisplayName(
                      (restaurant.lastUpdatedByLevel as ContributorLevel) || 'newbie',
                      false, // Don't show email in this context
                      restaurant.lastUpdatedBy
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Hours: </span>
            <span className="text-muted-foreground">{restaurant.openHours}</span>
          </div>
          
          <div>
            <span className="font-medium text-sm">Specialties:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {restaurant.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs max-w-[120px] truncate">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Fixed Update Price Section at Bottom */}
      <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <div className="space-y-3">
          <h4 className="font-medium">Update Teh Ais Price</h4>
          
          {!user ? (
            <Alert>
              <LogIn className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Please log in to update restaurant prices and contribute to the community.</p>
                  <p className="text-xs text-muted-foreground">
                    Help others find the best Teh Ais deals by sharing real prices!
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={onLoginRequest}
                  >
                    Click here to login →
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  RM
                </span>
                <Input
                  type="number"
                  step="0.10"
                  min="0"
                  placeholder="2.50"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button 
                onClick={handlePriceUpdate}
                disabled={!priceInput || isUpdating}
                className="bg-gradient-mamak hover:opacity-90 transition-opacity min-w-[80px]"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};