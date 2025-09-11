import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Eye, EyeOff, LogOut } from 'lucide-react';
import { UserProfile as UserProfileType, ContributorLevel } from '@/types/restaurant';
import { getContributorInfo, getNextLevelInfo } from '@/lib/contributorUtils';

interface UserProfileProps {
  userProfile: UserProfileType;
  onToggleEmailVisibility: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userProfile,
  onToggleEmailVisibility,
  onClose,
  onLogout
}) => {
  const currentLevel = getContributorInfo(userProfile.contributorLevel);
  const nextLevel = getNextLevelInfo(userProfile.contributorLevel);
  const progressToNext = nextLevel 
    ? Math.min(100, ((userProfile.contributionCount - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;

  return (
    <Card className="w-80 max-w-sm bg-white shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            <User className="h-5 w-5 inline mr-2" />
            Profile
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-200"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contributor Level */}
        <div className="text-center">
          <div className="text-3xl mb-2">{currentLevel.emoji}</div>
          <h3 className={`text-lg font-bold ${currentLevel.color}`}>
            {currentLevel.name}
          </h3>
          <p className="text-sm text-gray-600">
            {userProfile.contributionCount} contributions
          </p>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress to {nextLevel.emoji} {nextLevel.name}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {nextLevel.min - userProfile.contributionCount} more contributions needed
            </p>
          </div>
        )}

        {/* Privacy Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Privacy Settings</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {userProfile.showEmail ? (
                <Eye className="h-4 w-4 text-gray-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm">Show email in contributions</span>
            </div>
            <Switch
              checked={userProfile.showEmail}
              onCheckedChange={onToggleEmailVisibility}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            {userProfile.showEmail 
              ? "Your email will be shown as '🌱 user@example.com'"
              : "Your contributions will show as '🌱 Newbie Member'"
            }
          </p>
        </div>

        {/* Level Benefits */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Benefits</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>✓</span>
              <span>Update restaurant prices</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>✓</span>
              <span>Add new restaurants</span>
            </div>
            {userProfile.contributorLevel !== 'newbie' && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>✓</span>
                <span>Priority support</span>
              </div>
            )}
            {userProfile.contributorLevel === 'gold' || userProfile.contributorLevel === 'platinum' && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>✓</span>
                <span>Beta features access</span>
              </div>
            )}
          </div>
        </div>

        {/* Join Date */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Joined {new Date(userProfile.joinedAt).toLocaleDateString()}
        </div>

        {/* Logout Button */}
        <div className="pt-3">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
