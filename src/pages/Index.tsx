import { useState, useRef, useEffect } from "react";
import { MamakMap } from "@/components/MamakMap";
import { AdminPanel } from "@/components/AdminPanel";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut, X, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getContributorInfo } from "@/lib/contributorUtils";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showWelcomeLoggedIn, setShowWelcomeLoggedIn] = useState(true);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const welcomeLoggedInRef = useRef<HTMLDivElement>(null);
  const adminPanelRef = useRef<HTMLDivElement>(null);
  const userProfileRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, logout, loading, isAdmin, toggleEmailVisibility } = useAuth();

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

    if (showWelcome || showWelcomeLoggedIn || showAdmin || showUserProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWelcome, showWelcomeLoggedIn, showAdmin, showUserProfile]);

  return (
    <div className="w-full h-screen relative">
      <MamakMap onLoginRequest={() => setShowAuth(true)} />
      
      {/* Top Navigation - Mobile Optimized */}
      <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50 flex justify-between">
        <div className="flex gap-1 sm:gap-2">
          {/* Admin Panel Button - Only for admin users */}
          {isAdmin && (
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          )}
          
          {/* Add Restaurant Button - For all authenticated users */}
          {user && !isAdmin && (
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Restaurant</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {userProfile && (
                <Button
                  onClick={() => setShowUserProfile(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{getContributorInfo(userProfile.contributorLevel).emoji} Profile</span>
                  <span className="sm:hidden">{getContributorInfo(userProfile.contributorLevel).emoji}</span>
                </Button>
              )}
              <span className={`text-xs sm:text-sm text-white px-1 sm:px-2 py-1 rounded ${
                isAdmin ? 'bg-red-600/80' : 'bg-black/20'
              }`}>
                <span className="hidden sm:inline">
                  {isAdmin ? '👑 ' : '👤 '}{user.email}
                  {isAdmin && ' (Admin)'}
                </span>
                <span className="sm:hidden">
                  {isAdmin ? '👑' : '👤'}
                </span>
              </span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Welcome Banner - Mobile Optimized */}
      {!user && showWelcome && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-sm sm:max-w-md px-4">
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

      {/* Welcome Message for Logged-in Users - Mobile Optimized */}
      {user && showWelcomeLoggedIn && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xs sm:max-w-md px-4">
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
            />
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </div>
  );
};

export default Index;
