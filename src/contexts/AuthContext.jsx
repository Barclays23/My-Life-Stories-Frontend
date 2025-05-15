import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner1 from '../components/Loading Spinner/LoadingSpinner1';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : {};
          setCurrentUser({
            ...user,
            isAdmin: userData.isAdmin || false,
          });
        } catch (err) {
          console.error('Error fetching user data:', err);
          setCurrentUser({ ...user, isAdmin: false });
        }
      } else {
        setCurrentUser(null);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1000ms delay
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1000ms delay
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner1 />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout, logoutLoading, loading }}>
      {logoutLoading ? <LoadingSpinner1 /> : children}
    </AuthContext.Provider>
  );
};