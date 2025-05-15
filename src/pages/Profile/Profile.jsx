import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { auth, db, storage } from '../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
import { toast } from 'react-toastify';
import './Profile.css';







function Profile() {
   const [userData, setUserData] = useState({
      name: '',
      email: '',
      mobile: '',
      photoURL: '',
   });
   const [editData, setEditData] = useState({
      name: '',
      mobile: '',
      photo: null,
   });
   const [isEditing, setIsEditing] = useState(false);
   const [loading, setLoading] = useState(true);
   const { currentUser, logout, loading: authLoading, logoutLoading } = useContext(AuthContext);
   const navigate = useNavigate();

   // Fetch user data on mount
   useEffect(() => {
      const fetchUserData = async () => {
         if (authLoading || !currentUser) {
         setLoading(false); // Rely on ProtectedRoute for redirect
         return;
         }
         try {
         setLoading(true);
         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
         // Add 300ms delay for data fetching
         await new Promise((resolve) => setTimeout(resolve, 300));
         if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
               name: currentUser.displayName || data.name || '',
               email: currentUser.email || '',
               mobile: data.mobile || '',
               photoURL: currentUser.photoURL || '/assets/images/default-profile.jpg',
            });
            setEditData({
               name: currentUser.displayName || data.name || '',
               mobile: data.mobile || '',
               photo: null,
            });
         } else {
            toast.error('User data not found.');
         }
         } catch (err) {
         toast.error(err.message);
         } finally {
         setLoading(false);
         }
      };
      fetchUserData();
   }, [currentUser, authLoading, navigate]);

   const handleEditProfileSubmit = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         let photoURL = userData.photoURL;
         if (editData.photo) {
         const photoRef = ref(storage, `profile-pics/${currentUser.uid}`);
         await uploadBytes(photoRef, editData.photo);
         photoURL = await getDownloadURL(photoRef);
         }

         // Update Firebase Auth profile
         await updateProfile(auth.currentUser, {
         displayName: editData.name,
         photoURL,
         });

         // Update Firestore user document
         await updateDoc(doc(db, 'users', currentUser.uid), {
         name: editData.name,
         mobile: editData.mobile,
         photoURL,
         });

         // Add 300ms delay for form submission
         await new Promise((resolve) => setTimeout(resolve, 300));

         // Update local state
         setUserData({
         ...userData,
         name: editData.name,
         mobile: editData.mobile,
         photoURL,
         });
         toast.success('Profile updated successfully!');
         setIsEditing(false);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleLogout = async () => {
      try {
         await logout();
         toast.success('Logged out successfully!');
         navigate('/login');
      } catch (err) {
         toast.error(err.message);
      }
   };

   if (logoutLoading) {
      return <LoadingSpinner1 />;
   }

   if (loading || authLoading) {
      return <LoadingSpinner2 />;
   }

   return (
      <div className="profile mt-16">
         <div className="container mx-auto py-8">
         <div className="profile-card">
            <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

            {isEditing ? (
               <form onSubmit={handleEditProfileSubmit} className="max-w-md mx-auto">
               <div className="mb-4">
                  <label htmlFor="name" className="block text-text-color mb-1">
                     Name
                  </label>
                  <input
                     type="text"
                     id="name"
                     value={editData.name}
                     onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                     className="input"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="mobile" className="block text-text-color mb-1">
                     Mobile Number
                  </label>
                  <input
                     type="tel"
                     id="mobile"
                     value={editData.mobile}
                     onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                     className="input"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="photo" className="block text-text-color mb-1">
                     Profile Photo
                  </label>
                  <input
                     type="file"
                     id="photo"
                     accept="image/*"
                     onChange={(e) => setEditData({ ...editData, photo: e.target.files[0] })}
                     className="input"
                  />
                  {editData.photo && (
                     <img
                     src={URL.createObjectURL(editData.photo)}
                     alt="Preview"
                     className="profile-photo-preview mt-2"
                     />
                  )}
               </div>
               <button type="submit" className="btn">Save Changes</button>
               <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary mt-2"
               >
                  Cancel
               </button>
               </form>
            ) : (
               <div className="max-w-md mx-auto text-center">
               <img
                  src={userData.photoURL}
                  alt="Profile"
                  className="profile-photo mx-auto mb-4"
               />
               <p className="text-3xl mb-2">
                  <span className="font-bold"></span> {userData.name}
               </p>
               <p className="text-md mb-2 text-left">
                  <span className="font-bold">Email :</span> {userData.email}
               </p>
               <p className="text-md mb-4 text-left">
                  <span className="font-bold">Mobile :</span> {userData.mobile}
               </p>
               <button onClick={() => setIsEditing(true)} className="btn mb-2">
                  Edit Profile
               </button>
               <button onClick={handleLogout} className="btn btn-secondary mb-2">
                  Logout
               </button>
               <p>
                  <span
                     className="text-primary-color cursor-pointer"
                     onClick={() => navigate('/')}
                  >
                     Back to Home
                  </span>
               </p>
               </div>
            )}
         </div>
         </div>
      </div>
   );
}

export default Profile;