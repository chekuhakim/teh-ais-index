import { useState, useRef, useEffect } from "react";
import { MamakMap } from "@/components/MamakMap";
import { AdminPanel } from "@/components/AdminPanel";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { AddMamakModal } from "@/components/AddMamakModal";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut, X, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getContributorInfo } from "@/lib/contributorUtils";
import { useRestaurantsWithFallback } from "@/hooks/useRestaurantsWithFallback";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAddMamak, setShowAddMamak] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showWelcomeLoggedIn, setShowWelcomeLoggedIn] = useState(true);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const welcomeLoggedInRef = useRef<HTMLDivElement>(null);
  const adminPanelRef = useRef<HTMLDivElement>(null);
  const userProfileRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, logout, loading, isAdmin, toggleEmailVisibility } = useAuth();
  const { fetchRestaurants } = useRestaurantsWithFallback();

  // Click outside to close modals and banners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (welcomeRef.current && !welcomeRef.current.contains(event.target as Node)) {
        setShowWelcome(false);
      }
      if (welcomeLoggedInRef.current && !welcomeLoggedInRef.current.contains(event.target as Node)) {
        setShowWelcomeLoggedIn(false);
      }
      if (adminPanelRef.current && !adminPanelRef.current.contains(event.target as Node)) {
        setShowAdmin(false);
      }
      if (userProfileRef.current && !userProfileRef.current.contains(event.target as Node)) {
        setShowUserProfile(false);
      }
    };

    if (showWelcome || showWelcomeLoggedIn || showAdmin || showUserProfile || showPrices) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWelcome, showWelcomeLoggedIn, showAdmin, showUserProfile, showPrices]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <MamakMap onLoginRequest={() => setShowAuth(true)} />
      
      {/* Google Maps Style Top Bar */}
      <div className="top-bar absolute top-0 left-0 right-0 z-50">
        {/* Search Bar */}
        <div className="bg-white mx-4 mt-4 rounded-lg shadow-lg">
          <div className="flex items-center px-4 py-3">
            {/* Google Maps Logo */}
            <div className="flex items-center mr-3">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search mamak restaurants..."
                className="w-full text-gray-700 placeholder-gray-500 outline-none text-sm"
                readOnly
              />
            </div>
            
            {/* Voice Search */}
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
            
            {/* Camera/Lens */}
            <button className="p-2 text-gray-500 hover:text-gray-700 ml-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            
            {/* Profile Button */}
            <div className="ml-3">
              {user ? (
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-0.5"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    {userProfile ? (
                      <span className="text-sm">{getContributorInfo(userProfile.contributorLevel).emoji}</span>
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Buttons */}
        <div className="flex gap-2 px-4 mt-3 overflow-x-auto">
          {/* Prices Button */}
          <button 
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Prices
          </button>
          
          {/* Add Mamak Button - Visible to all, checks login on click */}
          <button 
            onClick={() => user ? setShowAddMamak(true) : setShowAuth(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Mamak
          </button>
          
          {/* Admin Panel Button - Only for admin users */}
          {isAdmin && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap"
            >
              <Settings className="w-4 h-4" />
              Admin
            </button>
          )}
        </div>
        
        {/* Price Legend Buttons */}
        <div className="flex gap-2 px-4 mt-2 overflow-x-auto">
          <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-sm text-xs font-medium whitespace-nowrap">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            &lt; RM 2.50
          </button>
          <button className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 rounded-full shadow-sm text-xs font-medium whitespace-nowrap">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            RM 2.50-3.50
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-sm text-xs font-medium whitespace-nowrap">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            &gt; RM 3.50
          </button>
        </div>
      </div>
      
      {/* Welcome Banner - Positioned below price legend buttons */}
      {!user && showWelcome && (
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm sm:max-w-md px-4">
          <div ref={welcomeRef} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-4 relative">
            <Button
              onClick={() => setShowWelcome(false)}
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 pr-6 sm:pr-8">
              🍜 Mamak AIS Price Tracker
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
              Discover and track Teh Ais prices at mamak restaurants across Malaysia.
            </p>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              <span className="flex-shrink-0 mt-0.5">💡</span>
              <span>Want to contribute? Login to add restaurants and update prices!</span>
            </div>
            <Button 
              onClick={() => setShowAuth(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm py-2"
            >
              Login to Contribute
            </Button>
          </div>
        </div>
      )}

      {/* Welcome Message for Logged-in Users - Positioned below price legend buttons */}
      {user && showWelcomeLoggedIn && (
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xs sm:max-w-md px-4">
          <div ref={welcomeLoggedInRef} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 relative">
            <Button
              onClick={() => setShowWelcomeLoggedIn(false)}
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-5 w-5 p-0 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 pr-6 sm:pr-8">
              <span className="flex-shrink-0 mt-0.5">👋</span>
              <span>Welcome back! Click restaurants to view and update prices.</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin Panel Overlay */}
      {showAdmin && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={adminPanelRef} className="relative">
            <Button
              onClick={() => setShowAdmin(false)}
              className="absolute -top-2 -right-2 z-10"
              variant="outline"
              size="sm"
            >
              ×
            </Button>
            <AdminPanel isAdmin={isAdmin} />
          </div>
        </div>
      )}
      
      {/* User Profile Modal */}
      {showUserProfile && userProfile && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={userProfileRef} className="relative">
            <Button
              onClick={() => setShowUserProfile(false)}
              className="absolute -top-2 -right-2 z-10"
              variant="outline"
              size="sm"
            >
              ×
            </Button>
            <UserProfile 
              userProfile={userProfile}
              onToggleEmailVisibility={toggleEmailVisibility}
              onClose={() => setShowUserProfile(false)}
              onLogout={logout}
            />
          </div>
        </div>
      )}
      
      {/* Prices Summary Modal */}
      {showPrices && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Teh Ais Price Summary</h2>
              <button
                onClick={() => setShowPrices(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">RM 1.85</div>
                  <div className="text-sm text-blue-600">Average Price</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">RM 0.40</div>
                  <div className="text-sm text-green-600">Price Range</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Top Restaurants</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">Restoran ABC</span>
                    <span className="text-green-600 font-bold">RM 1.50</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">Mamak Corner</span>
                    <span className="text-yellow-600 font-bold">RM 1.80</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">Nasi Kandar</span>
                    <span className="text-red-600 font-bold">RM 2.20</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowPrices(false)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
      
      {/* Add Mamak Modal */}
      <AddMamakModal
        isOpen={showAddMamak}
        onClose={() => setShowAddMamak(false)}
        onRestaurantAdded={async (restaurant) => {
          console.log('New restaurant added:', restaurant);
          // Refresh the map data to show the new restaurant
          try {
            await fetchRestaurants();
            console.log('✅ Map data refreshed with new restaurant');
          } catch (error) {
            console.error('❌ Failed to refresh map data:', error);
          }
        }}
      />
    </div>
  );
};

export default Index;
