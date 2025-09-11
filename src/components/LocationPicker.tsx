import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { mapboxServiceNetlify } from '@/services/mapboxServiceNetlify';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLat = 3.1390,
  initialLng = 101.6869,
  initialAddress = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Use Netlify function for geocoding
      const result = await mapboxServiceNetlify.searchLocation(searchQuery);
      
      if (result) {
        onLocationSelect(result.lat, result.lng, result.address);
        setSearchQuery(result.address);
      } else {
        setError('Location not found. Please try a different search term.');
      }
    } catch (err) {
      setError('Failed to search for location. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Finder
        </CardTitle>
        <CardDescription>
          Search for a location to automatically fill in coordinates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location-search">Search for location</Label>
          <div className="flex gap-2">
            <Input
              id="location-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Jalan SS 15/4b, Subang Jaya"
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>💡 <strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Include city/state for better results (e.g., "Kuala Lumpur", "Subang Jaya")</li>
            <li>Use specific street names or landmarks</li>
            <li>Try different variations if the first search doesn't work</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
