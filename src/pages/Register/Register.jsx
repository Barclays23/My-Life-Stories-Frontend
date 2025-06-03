import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../firebase/firebaseErrorMap';
import apiCalls from '../../utils/api';
import { useEffect } from 'react';



function Register() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [mobile, setMobile] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [photo, setPhoto] = useState(null);

   const [nameError, setNameError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [mobileError, setMobileError] = useState('');
   const [photoError, setPhotoError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [confirmPasswordError, setConfirmPasswordError] = useState('');


   const [loading, setLoading] = useState(false);
   const [photoPreview, setPhotoPreview] = useState(null)
   const navigate = useNavigate();

   useEffect(() => {
      return () => {
         if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
         }
      };
   }, [photoPreview]);


   /* ───────────────────────── VALIDATION ────────────────────────── */
   const validateInputs = () => {
      setNameError('');
      setEmailError('');
      setMobileError('');
      setPhotoError('');
      setPasswordError('');
      setConfirmPasswordError('');

      let isValid = true;

      const nameRegex = /^[A-Za-z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[0-9]{10}$/;

      if (!name.trim()) {
         setNameError('Please enter your name.');
         isValid = false;
      } else if (!nameRegex.test(name)) {
         setNameError('Name should contain only letters and spaces.');
         isValid = false;
      }

      if (!email) {
         setEmailError('Please enter your email.');
         isValid = false;
      } else if (!emailRegex.test(email)) {
         setEmailError('Enter a valid email address.');
         isValid = false;
      }

      if (!mobile || !mobileRegex.test(mobile)) {
         setMobileError('Enter a valid 10-digit mobile number.');
         isValid = false;
      }

      if (photo) {
         const allowedTypes = ['image/jpeg', 'image/png'];
         if (!allowedTypes.includes(photo.type)) {
            setPhotoError('Only JPG and PNG files are allowed.');
            isValid = false;
         }

         if (photo.size > 2 * 1024 * 1024) { // 2 MB
            setPhotoError('Image must be less than 2 MB.');
            isValid = false;
         }
      }

      if (!password) {
         setPasswordError('Enter your password.');
         isValid = false;
      } else if (password.length < 6) {
         setPasswordError('Password must be at least 6 characters.');
         isValid = false;
      }
      
      if (!confirmPassword) {
         setConfirmPasswordError('Please confirm your password.');
         isValid = false;
      } else if (confirmPassword !== password) {
         setConfirmPasswordError('Passwords do not match.');
         isValid = false;
      }

      return isValid;
   };


   /* ───────────────────────── HANDLE SUBMIT ────────────────────────────── */
   const handleRegisterFormSubmit = async (e) => {
      e.preventDefault();

      if (!validateInputs()) return;
      
      // assemble multipart/form-data
      const formData = new FormData();

      formData.append('name',     name);
      formData.append('email',    email);
      formData.append('mobile',   mobile);
      formData.append('password', password);
      if (photo) formData.append('photo', photo);

      
      try {
         // console.log('form data for registration :', formData);
         setLoading(true);
         const res = await apiCalls.signUp(formData);
         console.log('res after signUp :', res);
      
         if (res.success) {
            toast.success('Registration successful! Please sign in to continue');
            navigate('/login');
         } else {
            toast.error(res.error || 'Registration failed');
         }

      } catch (error) {
         // const errorMessage = firebaseErrorMap[err.code];
         let errorMessage = error.response?.data?.error || firebaseErrorMap.get(error?.code) || 'An unexpected error occurred. Please try again.';
         toast.error(errorMessage);

      } finally {
         setLoading(false);
      }
   };


   if (loading) {
      return <LoadingSpinner1 />;
   }

   return (
      <div className="register md:mt-10">
         <div className="container mx-auto py-8">
         <div className="register-card">
            <h2 className="register-title text-3xl font-bold mb-6 text-center">Register</h2>

            <form onSubmit={handleRegisterFormSubmit} className="max-w-md mx-auto">
               <div className="form-group">
               <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input"
               />
               {nameError && <p className="error-msg">{nameError}</p>}

               <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
               />
               {emailError && <p className="error-msg">{emailError}</p>}

               <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="input"
               />
               {mobileError && <p className="error-msg">{mobileError}</p>}

               {/* ───────── FILE INPUT + PREVIEW ───────── */}
               <div className="mb-4">
                  {/* hidden native file input */}
                  <input
                     id="photoInput"
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={e => {
                        const file = e.target.files[0];
                        setPhoto(file || null);

                        if (file) {
                        setPhotoPreview(URL.createObjectURL(file));
                        } else {
                        setPhotoPreview(null);
                        }
                     }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-1">
                     {/* preview + remove overlay */}
                     {photoPreview && (
                        <div className="relative inline-block">
                           <img src={photoPreview} alt="Preview" className="w-full h-40 sm:w-32 object-cover rounded border block"/>
                           <button
                              type="button"
                              title="Remove" 
                              className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs shadow"
                              onClick={() => {
                                 setPhoto(null);
                                 setPhotoPreview(null);
                                 document.getElementById('photoInput').value = ''; // reset file input
                              }} >
                              ✕
                           </button>
                        </div>
                     )}

                     {/* upload button */}
                     <label
                        htmlFor="photoInput"
                        className="inline-block cursor-pointer text-center bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-opacity-100 transition" >
                        {photo ? 'Change Photo' : 'Upload Photo'}
                     </label>
                     {photoError && <p className="error-msg mt-1">{photoError}</p>}
                  </div>
               </div>

               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input"
               />
               {passwordError && <p className="error-msg">{passwordError}</p>}

               <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input"
               />
               {confirmPasswordError && <p className="error-msg">{confirmPasswordError}</p>}

               <button type="submit" className="btn">Register</button>

               <p className="mt-7 login-link">
                  Already have an account? <Link to="/login" className="text-primary-color">Login</Link>
               </p>
               </div>
            </form>

         </div>
         </div>
      </div>
   );
}

export default Register;