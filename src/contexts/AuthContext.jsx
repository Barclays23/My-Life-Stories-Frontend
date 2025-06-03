import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoadingSpinner1 from '../components/Loading Spinner/LoadingSpinner1';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setcurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);

          const userDocRef = doc(db, 'users', firebaseUser.uid);
          // console.log('Fetching user document for UID:', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          // console.log('Document exists:', userDoc.exists());

          if (!userDoc.exists()) {
            // console.warn(`No user document found for UID: ${firebaseUser.uid}`);
            setcurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              isAdmin: false,
            });
          } else {
            const userData = userDoc.data();
            setcurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              isAdmin: userData.isAdmin === true,
              name: userData.name || '',
              photoURL: userData.photoURL || '',
              bio: userData.bio || '',
              readCount: userData.readCount || 0,
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setcurrentUser({ ...firebaseUser, isAdmin: false });
        }
      } else {
        setcurrentUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const logout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out: ' + err.message);
    } finally {
      setLogoutLoading(false);
    }
  };


  
  if (loading) {
    return <LoadingSpinner1 />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, logout, logoutLoading, loading }}>
      {logoutLoading ? <LoadingSpinner1 /> : children}
    </AuthContext.Provider>
  );
};