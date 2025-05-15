import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { auth, signOut } from '../../firebase/firebase';
import './Navbar.css';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-3">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="navbar-logo">
            <img src="/assets/logos/s23-logo-red.png" alt="Brocamp Life Logo" className="h-12" />
          </Link>
        </div>

        {/* Center-Right: Navigation Links, Profile, Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/stories" className="navbar-link">Stories</Link>
            <Link to="/books" className="navbar-link">Books</Link>
            {isAdmin && (
              <>
                <Link to="/create-book" className="navbar-link">Create Book</Link>
                <Link to="/add-story" className="navbar-link">Add Story</Link>
                <Link to="/admin-dashboard" className="navbar-link">Dashboard</Link>
              </>
            )}
          </div>
          {currentUser ? (
            <>
              <Link to="/profile" className="navbar-profile">
                <img
                  src={currentUser.photoURL || '/assets/images/default-story.jpg'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              </Link>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">Login</Link>
              <Link to="/register" className="navbar-button">Register</Link>
            </>
          )}
          <label className="navbar-toggle">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="hidden"
            />
            <span className="navbar-toggle-slider"></span>
          </label>
        </div>

        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="navbar-hamburger">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden navbar-mobile-menu">
          <Link to="/" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Home</Link>
          <Link to="/stories" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Stories</Link>
          <Link to="/books" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Books</Link>
          {isAdmin && (
            <>
              <Link to="/create-book" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Create Book</Link>
              <Link to="/add-story" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Add Story</Link>
              <Link to="/admin-dashboard" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Dashboard</Link>
            </>
          )}

          {currentUser ? (
            <>
              <Link to="/profile" className="navbar-link block py-2 px-4" onClick={toggleMenu}>Profile</Link>
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="navbar-button navbar-button-logout block w-full text-left py-2 px-4">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button navbar-button-logout block py-2 px-4" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="navbar-button navbar-button-logout block py-2 px-4" onClick={toggleMenu}>Register</Link>
            </>
          )}
          <label className="navbar-toggle block py-2 px-4">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="hidden"
            />
            <span className="navbar-toggle-slider"></span>
          </label>
        </div>
      )}
    </nav>
  );
};

export default Navbar;