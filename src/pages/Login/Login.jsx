import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import './Login.css';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('You have successfully signed in.');
      navigate('/');
    } catch (err) {
      const errorMessage = getErrorMessage[err.code] || 'Login Failed! Please try again.';
      console.log('login errorMessage:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link has been sent to your email! Check your inbox.');
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMessage = getErrorMessage[err.code] || 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setResetMode(false);
      }, 3000);
    }
  };

  const getErrorMessage = {
    'auth/invalid-email': 'The email address is badly formatted.',
    'auth/user-disabled': 'This account has been disabled by an administrator.',
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'The password is incorrect.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/internal-error': 'An internal error has occurred. Please try again.',
    'auth/missing-password': 'Please enter your password.',
    'auth/missing-email': 'Please enter your email address.',
    'auth/invalid-credential': 'Invalid credential. Please try logging in again.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
    'auth/weak-password': 'Password should be at least 6 characters.',
  };

  if (loading) {
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