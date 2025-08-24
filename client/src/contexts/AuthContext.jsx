import React, { createContext, useState, useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user authenticated:', firebaseUser.email);
        setFirebaseUser(firebaseUser);
        
        try {
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Send to backend to get/create user profile
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL
            })
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            setUser(data.user);
          } else {
            console.error('Backend authentication failed');
          }
        } catch (error) {
          console.error('Error during backend authentication:', error);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Sign in failed. Please try again.' };
    }
  };

  const signUp = async (email, password, username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, username })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in...');
      
      if (!auth || !googleProvider) {
        throw new Error('Firebase not properly configured');
      }

      const result = await signInWithPopup(auth, googleProvider);
      // Firebase auth state change will handle the rest
      return { success: true };
    } catch (error) {
      console.error('Google sign in failed:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in cancelled' };
      } else if (error.code === 'auth/network-request-failed') {
        return { success: false, error: 'Network error. Please check your connection.' };
      } else if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Popup blocked. Please allow popups for this site.' };
      }
      
      return { success: false, error: 'Google sign in failed. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getFirebaseToken = async () => {
    if (firebaseUser) {
      return await firebaseUser.getIdToken();
    }
    return null;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getToken,
    getFirebaseToken,
    updateUser,
    isSignedIn: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
   

  


