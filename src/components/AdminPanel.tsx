import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurantsWithFallback } from '@/hooks/useRestaurantsWithFallback';
import { AddRestaurantForm } from './AddRestaurantForm';
import { FirebaseStatus } from './FirebaseStatus';

interface AdminPanelProps {
  isAdmin: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { restaurants, fetchRestaurants, usingFallback } = useRestaurantsWithFallback();


  const handleRestaurantAdded = () => {
    setMessage({ type: 'success', text: 'Restaurant added successfully!' });
    fetchRestaurants();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Firebase Admin Panel</CardTitle>
        <CardDescription>
          Manage your Firebase database and restaurants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-2'}`}>
            <TabsTrigger value="overview">
              {isAdmin ? 'Overview' : 'My Contributions'}
            </TabsTrigger>
            <TabsTrigger value="add">Add Restaurant</TabsTrigger>
            {isAdmin && <TabsTrigger value="manage">Manage Data</TabsTrigger>}
            {isAdmin && <TabsTrigger value="firebase">Firebase</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isAdmin ? 'Database Status' : 'My Contributions'}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Current restaurants: <strong>{restaurants.length}</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${usingFallback ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm">
                      {usingFallback ? 'No data available (Firebase not configured)' : 'Connected to Firebase'}
                    </span>
                  </div>
                  {usingFallback && (
                    <p className="text-xs text-yellow-600">
                      <a 
                        href="https://console.firebase.google.com/project/mamak-a7768" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Set up Firebase
                      </a> to save data permanently.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Current Restaurants</h3>
                {restaurants.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div className="flex-1">
                          <span className="font-medium">{restaurant.name}</span>
                          <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            {restaurant.tehAisPrice ? `RM ${restaurant.tehAisPrice}` : 'No price'}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Rating: {restaurant.rating} ⭐
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No restaurants found. Add some using the "Add Restaurant" tab.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <AddRestaurantForm 
              onSuccess={handleRestaurantAdded}
            />
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="manage" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Database Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your Firebase database and add restaurant data
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Use the "Add Restaurant" form below to add your first restaurant data.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={fetchRestaurants}
                  variant="outline"
                  className="w-full"
                >
                  Refresh Data
                </Button>
                <p className="text-xs text-muted-foreground">
                  Reload restaurant data from Firebase
                </p>
              </div>
            </div>
            </TabsContent>
          )}
          
          {isAdmin && (
            <TabsContent value="firebase">
              <FirebaseStatus />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
