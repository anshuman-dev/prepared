import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);

          // Fetch or create user profile from backend
          try {
            const profileData = await authAPI.getProfile();
            setUser({ ...firebaseUser, profile: profileData.profile });
          } catch (error) {
            // User exists in Firebase but not in backend (shouldn't happen normally)
            console.error('Profile fetch error:', error);
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('Token error:', error);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Backend will automatically fetch/create profile via onAuthStateChanged
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : error.code === 'auth/user-not-found'
        ? 'User not found'
        : error.code === 'auth/wrong-password'
        ? 'Invalid password'
        : 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // Check if user profile exists in backend, create if not
      try {
        await authAPI.getProfile();
      } catch (error) {
        // Profile doesn't exist, create it with basic info
        await authAPI.createProfileFromGoogle({
          email: result.user.email,
          fullName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      }

      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      }
      throw new Error(error.message || 'Google sign-in failed');
    }
  };

  const signup = async (userData) => {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);

      // 2. Create basic user profile in Firestore via backend
      await authAPI.signup({
        email: userData.email,
        fullName: userData.fullName
      });

      return userCredential.user;
    } catch (error) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : error.code === 'auth/weak-password'
        ? 'Password is too weak'
        : 'Signup failed';
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = (profile) => {
    // Update local user state with profile data
    setUser(prev => ({ ...prev, profile }));
  };

  const isProfileComplete = (profile) => {
    // Check if user has completed onboarding
    return profile && profile.visaType && profile.country && profile.field;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profile) => {
    try {
      const data = await authAPI.updateProfile(profile);
      const updatedUser = { ...user, profile: data.profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    updateUserProfile,
    isProfileComplete
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
