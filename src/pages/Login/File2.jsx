import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import './Login.css';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../firebase/firebaseErrorMap';
import apiCalls from '../../utils/api';



function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [emailError, setEmailError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [resetMode, setResetMode] = useState(false);
   const [formLoading, setFormLoading] = useState(false);

   const navigate = useNavigate();

   // FORM VALIDATIONS
   const validateInputs = () => {
      setEmailError('');
      setPasswordError('');

      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
         setEmailError('Please enter your email address.');
         isValid = false;
      } else if (!emailRegex.test(email)) {
         setEmailError('Please enter a valid email address.');
         isValid = false;
      }

      if (!resetMode) {
         if (!password) {
            setPasswordError('Please enter your password.');
            isValid = false;
         } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
         }
      }

      return isValid;
   };

   // HANDLE LOGIN FORM SUBMISSION
   const handleLoginFormSubmit = async (e) => {
      e.preventDefault();
      if (!validateInputs()) return;

      const credentials = {
         email ,
         password
      };

      try {         
         setFormLoading(true);
         console.log(credentials);
         
         const res = await apiCalls.signIn({email, password});
         // console.log('res in frontend :', res);
         toast.success('You have successfully signed in.');
         navigate('/');

      } catch (error) {
         const backendCode = error.response?.data?.code;
         const backendText = error.response?.data?.error;

         const errorMessage =
            firebaseErrorMap.get(backendCode) ||   // <-- primary lookup
            backendText ||                         // fallback raw text
            'An unexpected error occurred. Please try again.';

         toast.error(errorMessage);
         
      } finally {
         setFormLoading(false);
      }
   };


   // HANDLE RESET FORM SUBMISSION
   const handleResetFormSubmit = async (e) => {
      e.preventDefault();
      setEmailError('');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
         setEmailError('Please enter your email address.');
         return;
      } else if (!emailRegex.test(email)) {
         setEmailError('Please enter a valid email address.');
         return;
      }

      try {
         setFormLoading(true);
         // await sendPasswordResetEmail(auth, email);
         await apiCalls.resetPassword(email);
         toast.success('Password reset link has been sent to your email! Check your inbox.');
         setEmail('');
         setPassword('');

      } catch (error) {
         const errorMessage = error.response?.data?.error || firebaseErrorMap.get(error?.code) || 'An unexpected error occurred. Please try again.';
         toast.error(errorMessage);

      } finally {
         setFormLoading(false);
         setTimeout(() => {
         setResetMode(false);
         }, 3000);
      }
   };



   if (formLoading) {
      return <LoadingSpinner1 />;
   }

   return (
      <div className="login mt-16 md:mt-28">
         <div className="container mx-auto py-8">
         <div className="login-card">
            <h2 className="login-title text-center text-2xl mb-2">
               {resetMode ? 'Reset Password' : 'Login'}
            </h2>
            <div className="login-form-container max-w-md mx-auto">
               <div className="form-group">
               <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  aria-describedby={emailError ? 'email-error' : undefined}
               />
               {emailError && (
                  <span className="error-msg" id="email-error">
                     {emailError}
                  </span>
               )}
               </div>

               {!resetMode && (
               <div className="form-group">
                  <input
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="input"
                     aria-describedby={passwordError ? 'password-error' : undefined}
                  />
                  {passwordError && (
                     <span className="error-msg" id="password-error">
                     {passwordError}
                     </span>
                  )}
               </div>
               )}

               {!resetMode && (
               <p className="forget-password-link text-right mb-7">
                  <span
                     className="text-primary-color cursor-pointer"
                     onClick={() => setResetMode(true)}
                  >
                     Forgot Password?
                  </span>
               </p>
               )}

               <button type="submit" className="btn" onClick={resetMode ? handleResetFormSubmit : handleLoginFormSubmit}>
               {resetMode ? 'Send Reset Email' : 'Login'}
               </button>

               <div className="form-links mt-3">
               {resetMode && (
                  <p className="back-to-login">
                     <span onClick={() => setResetMode(false)}>
                     Back to{' '}
                     <span className="text-primary-color cursor-pointer">
                        Login
                     </span>
                     </span>
                  </p>
               )}
               <p className="register-link text-left mt-5">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-color">
                     Register
                  </Link>
               </p>
               </div>
            </div>
         </div>
         </div>
      </div>
   );
}

export default Login;