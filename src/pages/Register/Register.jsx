import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Register.css';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');


  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getErrorMessage = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'The email address is invalid.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password is too weak (minimum 6 characters).',
  };


  const validateInputs = () => {
    setNameError('');
    setEmailError('');
    setMobileError('');
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

    if (!password) {
      setPasswordError('Enter your password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }
    
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };



  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;
    

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';

      if (photo) {
        const photoRef = ref(storage, `profile-pics/${user.uid}`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }

      await updateProfile(user, { displayName: name, photoURL });

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        mobile: mobile,
        photoURL,
        isAdmin: false
      });


      toast.success('Registration successful!');
      navigate('/');

    } catch (err) {
      const errorMessage = getErrorMessage[err.code];
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

              <input
                type="file"
                onChange={e => setPhoto(e.target.files[0])}
                className="input"
              />

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