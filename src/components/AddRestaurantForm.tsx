import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAuth } from '@/hooks/useAuth';
import { MamakRestaurant } from '@/types/restaurant';
import { LocationPicker } from './LocationPicker';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import { RestaurantFromGoogle } from '@/services/googlePlacesService';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  address: z.string().min(1, 'Address is required'),
  lat: z.number().min(-90).max(90, 'Invalid latitude'),
  lng: z.number().min(-180).max(180, 'Invalid longitude'),
  tehAisPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)')
  ]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  // Optional food prices
  rotiCanaiPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  meeGorengPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  nasiLemakPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  tehTarikPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  nasiKandarPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  rotiTelurPrice: z.union([
    z.number().min(0.01, 'Please enter a valid price (minimum RM 0.01)'),
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01;
    }, 'Please enter a valid price (minimum RM 0.01)'),
    z.literal('')
  ]).transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return typeof val === 'string' ? parseFloat(val) : val;
  }).optional(),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  isOpen: z.boolean(),
  openHours: z.string().min(1, 'Opening hours are required'),
  specialties: z.string().min(1, 'At least one specialty is required'),
  reviewCount: z.number().min(0, 'Review count must be positive')
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

interface AddRestaurantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddRestaurantForm: React.FC<AddRestaurantFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addRestaurant } = useRestaurants();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      address: '',
      lat: 3.1390, // Default to Kuala Lumpur center
      lng: 101.6869,
      tehAisPrice: undefined,
      rotiCanaiPrice: undefined,
      meeGorengPrice: undefined,
      nasiLemakPrice: undefined,
      tehTarikPrice: undefined,
      nasiKandarPrice: undefined,
      rotiTelurPrice: undefined,
      rating: 4.0,
      isOpen: true,
      openHours: '24 Hours',
      specialties: '',
      reviewCount: 0
    }
  });

  const isOpen = watch('isOpen');

  const handleGoogleRestaurantSelect = (restaurant: RestaurantFromGoogle) => {
    console.log('Google restaurant selected in AddRestaurantForm:', restaurant);
    setValue('name', restaurant.name);
    setValue('address', restaurant.address);
    setValue('lat', restaurant.coordinates.lat);
    setValue('lng', restaurant.coordinates.lng);
    setValue('rating', restaurant.rating);
    setValue('reviewCount', restaurant.reviewCount);
    setValue('isOpen', restaurant.isOpen);
    setValue('openHours', restaurant.openHours);
    setValue('specialties', restaurant.specialties.join(', '));
    
    // Note: Google Places doesn't provide specific Teh Ais Bungkus Ikat Tepi prices
    // Leave tehAisPrice empty for user to fill in with actual price
    
    // Don't auto-submit - let user review and add price first
    console.log('Restaurant data populated, ready for user review');
  };

  const onSubmit = async (data: RestaurantFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse specialties from comma-separated string
      const specialties = data.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const restaurantData: Omit<MamakRestaurant, 'id'> = {
        name: data.name,
        address: data.address,
        coordinates: {
          lat: data.lat,
          lng: data.lng
        },
        tehAisPrice: data.tehAisPrice || null,
        rotiCanaiPrice: data.rotiCanaiPrice || null,
        meeGorengPrice: data.meeGorengPrice || null,
        nasiLemakPrice: data.nasiLemakPrice || null,
        tehTarikPrice: data.tehTarikPrice || null,
        nasiKandarPrice: data.nasiKandarPrice || null,
        rotiTelurPrice: data.rotiTelurPrice || null,
        rating: data.rating,
        isOpen: data.isOpen,
        openHours: data.openHours,
        specialties,
        reviewCount: data.reviewCount,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: user?.email || 'Anonymous'
      };

      await addRestaurant(restaurantData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Add New Restaurant</CardTitle>
        <CardDescription>
          Find and add mamak restaurants using GPS location or search by name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GooglePlacesSearch 
          onRestaurantSelect={handleGoogleRestaurantSelect}
        />
        
        {/* Restaurant Review Form - shown after selection */}
        {watch('name') && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Review & Add Teh Ais Bungkus Ikat Tepi Price</CardTitle>
              <CardDescription>
                Please review the restaurant details and add the actual Teh Ais Bungkus Ikat Tepi price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tehAisPrice">Teh Ais Bungkus Ikat Tepi Price (RM) *</Label>
                  <Input
                    id="tehAisPrice"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register('tehAisPrice')}
                    placeholder="Enter actual price (e.g., 2.50)"
                    className="text-lg font-semibold"
                  />
                  {errors.tehAisPrice && (
                    <p className="text-sm text-destructive">
                      {errors.tehAisPrice.message || 'Please enter a valid price (minimum RM 0.01)'}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the actual price you paid for Teh Ais Bungkus Ikat Tepi at this restaurant
                  </p>
                </div>

                {/* Optional Food Prices */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Other Food Prices (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add prices for other popular mamak dishes if you know them
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rotiCanaiPrice">Roti Canai Price (RM)</Label>
                      <Input
                        id="rotiCanaiPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('rotiCanaiPrice')}
                        placeholder="e.g., 1.50"
                      />
                      {errors.rotiCanaiPrice && (
                        <p className="text-sm text-destructive">{errors.rotiCanaiPrice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meeGorengPrice">Mee Goreng Price (RM)</Label>
                      <Input
                        id="meeGorengPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('meeGorengPrice')}
                        placeholder="e.g., 4.50"
                      />
                      {errors.meeGorengPrice && (
                        <p className="text-sm text-destructive">{errors.meeGorengPrice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nasiLemakPrice">Nasi Lemak Price (RM)</Label>
                      <Input
                        id="nasiLemakPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('nasiLemakPrice')}
                        placeholder="e.g., 3.00"
                      />
                      {errors.nasiLemakPrice && (
                        <p className="text-sm text-destructive">{errors.nasiLemakPrice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tehTarikPrice">Teh Tarik Price (RM)</Label>
                      <Input
                        id="tehTarikPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('tehTarikPrice')}
                        placeholder="e.g., 2.00"
                      />
                      {errors.tehTarikPrice && (
                        <p className="text-sm text-destructive">{errors.tehTarikPrice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nasiKandarPrice">Nasi Kandar Price (RM)</Label>
                      <Input
                        id="nasiKandarPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('nasiKandarPrice')}
                        placeholder="e.g., 5.50"
                      />
                      {errors.nasiKandarPrice && (
                        <p className="text-sm text-destructive">{errors.nasiKandarPrice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rotiTelurPrice">Roti Telur Price (RM)</Label>
                      <Input
                        id="rotiTelurPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('rotiTelurPrice')}
                        placeholder="e.g., 2.50"
                      />
                      {errors.rotiTelurPrice && (
                        <p className="text-sm text-destructive">{errors.rotiTelurPrice.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      {...register('rating', { valueAsNumber: true })}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openHours">Opening Hours</Label>
                    <Input
                      id="openHours"
                      {...register('openHours')}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties</Label>
                  <Input
                    id="specialties"
                    {...register('specialties')}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding Restaurant...' : 'Add Restaurant'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
