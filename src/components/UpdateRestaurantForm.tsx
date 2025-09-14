import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MamakRestaurant } from '@/types/restaurant';

const updateRestaurantSchema = z.object({
  tehAisPrice: z.union([
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
  }),
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
});

type UpdateRestaurantFormData = z.infer<typeof updateRestaurantSchema>;

interface UpdateRestaurantFormProps {
  restaurant: MamakRestaurant;
  onSuccess?: () => void;
  onCancel?: () => void;
  onUpdateRestaurant: (restaurantId: string, updates: Partial<MamakRestaurant>) => Promise<void>;
}

export const UpdateRestaurantForm: React.FC<UpdateRestaurantFormProps> = ({ 
  restaurant,
  onSuccess, 
  onCancel,
  onUpdateRestaurant
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateRestaurantFormData>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      tehAisPrice: restaurant.tehAisPrice || '',
      rotiCanaiPrice: restaurant.rotiCanaiPrice || '',
      meeGorengPrice: restaurant.meeGorengPrice || '',
      nasiLemakPrice: restaurant.nasiLemakPrice || '',
      tehTarikPrice: restaurant.tehTarikPrice || '',
      nasiKandarPrice: restaurant.nasiKandarPrice || '',
      rotiTelurPrice: restaurant.rotiTelurPrice || '',
    }
  });

  const onSubmit = async (data: UpdateRestaurantFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updates: Partial<MamakRestaurant> = {
        tehAisPrice: data.tehAisPrice,
        rotiCanaiPrice: data.rotiCanaiPrice,
        meeGorengPrice: data.meeGorengPrice,
        nasiLemakPrice: data.nasiLemakPrice,
        tehTarikPrice: data.tehTarikPrice,
        nasiKandarPrice: data.nasiKandarPrice,
        rotiTelurPrice: data.rotiTelurPrice,
        lastUpdated: new Date().toISOString(),
      };

      await onUpdateRestaurant(restaurant.id, updates);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Update Restaurant Prices</CardTitle>
        <CardDescription>
          Update prices for {restaurant.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Teh Ais Price - Required */}
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
          </div>

          {/* Optional Food Prices */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Other Food Prices (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add or update prices for other popular mamak dishes
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

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Restaurant'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
