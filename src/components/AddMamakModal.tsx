import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, MapPin, Coffee, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import { RestaurantFromGoogle } from '@/types/restaurant';

interface AddMamakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestaurantAdded?: (restaurant: any) => void;
}

export const AddMamakModal: React.FC<AddMamakModalProps> = ({
  isOpen,
  onClose,
  onRestaurantAdded
}) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [tehAisPrice, setTehAisPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantFromGoogle | null>(null);
  const [showGoogleSearch, setShowGoogleSearch] = useState(true);
  const { user } = useAuth();

  const handleRestaurantSelect = (restaurant: RestaurantFromGoogle) => {
    setSelectedRestaurant(restaurant);
    setRestaurantName(restaurant.name);
    setAddress(restaurant.address);
    setShowGoogleSearch(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurantName.trim() || !address.trim() || !tehAisPrice.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual restaurant creation logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRestaurant = {
        id: Date.now().toString(),
        name: restaurantName.trim(),
        address: address.trim(),
        tehAisPrice: parseFloat(tehAisPrice),
        coordinates: selectedRestaurant?.coordinates || { lat: 0, lng: 0 },
        rating: selectedRestaurant?.rating || 0,
        reviewCount: selectedRestaurant?.reviewCount || 0,
        isOpen: selectedRestaurant?.isOpen || true,
        openHours: selectedRestaurant?.openHours || '24 Hours',
        specialties: selectedRestaurant?.specialties || ['Teh Ais', 'Nasi Kandar'],
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: user?.email || 'Unknown',
        lastUpdatedByLevel: 'newbie'
      };

      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setRestaurantName('');
        setAddress('');
        setTehAisPrice('');
        setSelectedRestaurant(null);
        setShowGoogleSearch(true);
        setShowSuccess(false);
        onRestaurantAdded?.(newRestaurant);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding restaurant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div 
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white shadow-lg border-0 max-h-[90vh] overflow-y-auto">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">
                Add New Mamak
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {showSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Restaurant Added Successfully!
                </h3>
                <p className="text-sm text-gray-600">
                  Your new mamak restaurant has been added to the map.
                </p>
              </div>
            ) : showGoogleSearch ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Search className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Search for Restaurant
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use Google Places to find and add a new mamak restaurant
                  </p>
                </div>
                
                <GooglePlacesSearch
                  onRestaurantSelect={handleRestaurantSelect}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Selected Restaurant Info */}
                {selectedRestaurant && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Selected Restaurant</span>
                    </div>
                    <p className="text-sm text-green-700 font-medium">{selectedRestaurant.name}</p>
                    <p className="text-xs text-green-600">{selectedRestaurant.address}</p>
                    {selectedRestaurant.rating > 0 && (
                      <p className="text-xs text-green-600">⭐ {selectedRestaurant.rating} ({selectedRestaurant.reviewCount} reviews)</p>
                    )}
                  </div>
                )}

                {/* Restaurant Name */}
                <div className="space-y-2">
                  <Label htmlFor="restaurantName" className="text-sm font-medium">
                    Restaurant Name *
                  </Label>
                  <Input
                    id="restaurantName"
                    type="text"
                    placeholder="e.g., Restoran Nasi Kandar ABC"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="e.g., 123, Jalan ABC, Kuala Lumpur"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                {/* Teh Ais Price */}
                <div className="space-y-2">
                  <Label htmlFor="tehAisPrice" className="text-sm font-medium">
                    Teh Ais Price (RM) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      RM
                    </span>
                    <Input
                      id="tehAisPrice"
                      type="number"
                      step="0.10"
                      min="0"
                      placeholder="2.50"
                      value={tehAisPrice}
                      onChange={(e) => setTehAisPrice(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the actual price you paid for Teh Ais at this restaurant
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGoogleSearch(true)}
                    className="flex-1"
                  >
                    Search Again
                  </Button>
                  <Button
                    type="submit"
                    disabled={!restaurantName.trim() || !address.trim() || !tehAisPrice.trim() || isSubmitting}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Restaurant'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
