import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, MapPin, Coffee, CheckCircle, Edit3, Share2 } from 'lucide-react';
import { MamakRestaurant } from '@/types/restaurant';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurantsWithFallback } from '@/hooks/useRestaurantsWithFallback';
import { SharePriceModal } from './SharePriceModal';

interface UpdatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: MamakRestaurant | null;
  onPriceUpdated?: (restaurant: MamakRestaurant) => void;
  enableSharing?: boolean;
}

export const UpdatePriceModal: React.FC<UpdatePriceModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onPriceUpdated,
  enableSharing = true
}) => {
  const [newPrice, setNewPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState<number>(0);
  const { user, userProfile } = useAuth();
  const { updateRestaurantPrice } = useRestaurantsWithFallback();

  // Reset form when restaurant changes
  React.useEffect(() => {
    if (restaurant) {
      setNewPrice(restaurant.tehAisPrice?.toString() || '');
      setError(null);
      setShowSuccess(false);
      setShowShareModal(false);
      setUpdatedPrice(0);
    }
  }, [restaurant]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setNewPrice('');
      setError(null);
      setShowSuccess(false);
      setShowShareModal(false);
      setUpdatedPrice(0);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('UpdatePriceModal: handleSubmit called');
    
    if (!restaurant || !newPrice.trim()) {
      console.log('UpdatePriceModal: Validation failed - no restaurant or price');
      setError('Please enter a valid price');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      console.log('UpdatePriceModal: Validation failed - invalid price:', price);
      setError('Please enter a valid price (must be a positive number)');
      return;
    }

    console.log('UpdatePriceModal: Starting submission process');
    setIsSubmitting(true);
    setError(null);
    console.log('Starting price update for:', restaurant.name, 'New price:', price);
    
    try {
      const contributorInfo = userProfile ? {
        username: userProfile.displayName || user?.email || 'Anonymous',
        contributorLevel: userProfile.contributorLevel || 'newbie',
        showEmail: userProfile.showEmail || false
      } : {
        username: user?.email || 'Anonymous',
        contributorLevel: 'newbie' as const,
        showEmail: false
      };

      await updateRestaurantPrice(
        restaurant.id,
        price,
        user?.uid,
        contributorInfo.username,
        contributorInfo.contributorLevel,
        contributorInfo.showEmail
      );

      setUpdatedPrice(price);
      setShowSuccess(true);
      console.log('Price update successful, showing success screen');
      
      if (enableSharing) {
        // Show share modal after success
        setTimeout(() => {
          console.log('Transitioning to share modal');
          setShowSuccess(false);
          setShowShareModal(true);
        }, 2000);

        // Fallback: auto-close after 10 seconds if sharing modal doesn't work
        setTimeout(() => {
          if (showShareModal) {
            console.log('Auto-closing modal after timeout');
            setShowShareModal(false);
            setNewPrice('');
            onPriceUpdated?.(restaurant);
            onClose();
          }
        }, 10000);
      } else {
        // Skip sharing, close modal after success
        setTimeout(() => {
          setShowSuccess(false);
          setNewPrice('');
          onPriceUpdated?.(restaurant);
          onClose();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error updating price:', error);
      setError('Failed to update price. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('UpdatePriceModal render:', { isOpen, restaurant: restaurant?.name, showSuccess, showShareModal, isSubmitting });
  
  if (!isOpen || !restaurant) {
    console.log('UpdatePriceModal: Not rendering - isOpen:', isOpen, 'restaurant:', restaurant?.name);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md">
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-500" />
                Update Price
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
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
                  Price Updated Successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  The price for {restaurant.name} has been updated to RM{updatedPrice}.
                </p>
                {enableSharing ? (
                  <>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <Share2 className="h-4 w-4" />
                      <span>Preparing sharing options...</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSuccess(false);
                        setNewPrice('');
                        onPriceUpdated?.(restaurant);
                        onClose();
                      }}
                      className="mt-2"
                    >
                      Skip Sharing & Close
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Price updated successfully!</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Restaurant Info */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Restaurant Details</span>
                  </div>
                  <p className="text-sm text-blue-700 font-medium">{restaurant.name}</p>
                  <p className="text-xs text-blue-600">{restaurant.address}</p>
                  <p className="text-xs text-blue-600">Current Price: RM {restaurant.tehAisPrice}</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Update Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPrice" className="text-sm font-medium">
                      New Teh Ais Bungkus Ikat Tepi Price (RM) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        RM
                      </span>
                      <Input
                        id="newPrice"
                        type="number"
                        step="0.10"
                        min="0"
                        placeholder="2.50"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter the current price you paid for Teh Ais Bungkus Ikat Tepi at this restaurant
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!newPrice.trim() || isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSubmitting ? 'Updating Price...' : 'Update Price'}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Share Price Modal */}
      {restaurant && enableSharing && (
        <SharePriceModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setNewPrice('');
            onPriceUpdated?.(restaurant);
            onClose();
          }}
          restaurant={restaurant}
          newPrice={updatedPrice}
          oldPrice={restaurant.tehAisPrice || undefined}
        />
      )}
    </div>
  );
};
