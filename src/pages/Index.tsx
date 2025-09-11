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
      
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between">
        <div className="flex gap-2">
          {/* Admin Panel Button - Only for admin users */}
          {isAdmin && (
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
          
          {/* Add Restaurant Button - For all authenticated users */}
          {user && !isAdmin && (
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {userProfile && (
                <Button
                  onClick={() => setShowUserProfile(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <User className="h-4 w-4 mr-2" />
                  {getContributorInfo(userProfile.contributorLevel).emoji} Profile
                </Button>
              )}
              <span className={`text-sm text-white px-2 py-1 rounded ${
                isAdmin ? 'bg-red-600/80' : 'bg-black/20'
              }`}>
                {isAdmin ? '👑 ' : '👤 '}{user.email}
                {isAdmin && ' (Admin)'}
              </span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              size="sm"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
      
      {/* Welcome Banner */}
      {!user && showWelcome && (
        <div className="absolute top-20 left-4 right-4 z-40">
          <div ref={welcomeRef} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-md relative">
            <Button
              onClick={() => setShowWelcome(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-gray-900 mb-2 pr-8">
              🍜 Mamak AIS Price Tracker
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Discover and track Teh Ais prices at mamak restaurants across Malaysia. 
              Find the best deals and help the community by sharing real prices!
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>💡</span>
              <span>Want to contribute? Please login to add restaurants and update prices!</span>
            </div>
            <Button 
              onClick={() => setShowAuth(true)}
              className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Login to Contribute
            </Button>
          </div>
        </div>
      )}

      {/* Welcome Message for Logged-in Users */}
      {user && showWelcomeLoggedIn && (
        <div className="absolute top-20 left-4 right-4 z-40">
          <div ref={welcomeLoggedInRef} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-md relative">
            <Button
              onClick={() => setShowWelcomeLoggedIn(false)}
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-700 pr-8">
              <span>👋</span>
              <span>Welcome back! Click on restaurants to view prices and update them.</span>
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
