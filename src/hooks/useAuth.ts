import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile, ContributorLevel } from '@/types/restaurant';
import { calculateContributorLevel } from '@/lib/contributorUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Admin email - only this user can access admin features
  const ADMIN_EMAIL = 'chekuhakim@gmail.com';
  
  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Load or create user profile
  const loadUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const profile = userSnap.data() as UserProfile;
        setUserProfile(profile);
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          contributorLevel: 'newbie',
          contributionCount: 0,
          showEmail: false, // Default to not showing email
          joinedAt: new Date().toISOString()
        };
        
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    }
  };

  // Update user profile settings
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedProfile = { ...userProfile, ...updates };
      
      // Recalculate contributor level if contribution count changed
      if (updates.contributionCount !== undefined) {
        updatedProfile.contributorLevel = calculateContributorLevel(updates.contributionCount);
      }
      
      await updateDoc(userRef, updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Increment user contribution count
  const incrementContribution = async () => {
    if (!userProfile) return;
    
    const newCount = userProfile.contributionCount + 1;
    await updateUserProfile({ contributionCount: newCount });
  };

  // Toggle email visibility
  const toggleEmailVisibility = async () => {
    if (!userProfile) return;
    
    await updateUserProfile({ showEmail: !userProfile.showEmail });
  };

  return {
    user,
    userProfile,
    loading,
    error,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
    incrementContribution,
    toggleEmailVisibility
  };
};
