import React, { useState } from 'react';
import { MamakRestaurant } from '@/types/restaurant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Star, MapPin, Coffee } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: MamakRestaurant;
  onClose: () => void;
  onUpdatePrice: (price: number) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClose,
  onUpdatePrice,
}) => {
  const [priceInput, setPriceInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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
    <Card className="w-80 bg-gradient-card shadow-card border-0">
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

      <CardContent className="space-y-4">
        {/* Current Price Display */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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

        {/* Update Price Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Update Teh Ais Price</h4>
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
              className="bg-gradient-mamak hover:opacity-90 transition-opacity"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
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
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {restaurant.lastUpdated && (
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(restaurant.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};