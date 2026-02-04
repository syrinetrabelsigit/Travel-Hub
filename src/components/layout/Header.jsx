import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">TravelHub</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/')}`}
              onClick={closeMenu}
            >
              Accueil
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about')}`}
              onClick={closeMenu}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact')}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <Link 
              to="/terms" 
              className={`nav-link ${isActive('/terms')}`}
              onClick={closeMenu}
            >
              Conditions
            </Link>

            {/* Liens mobile uniquement */}
            <div className="mobile-only-links">
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile')}`}
                onClick={closeMenu}
              >
                Mon Profil
              </Link>
              <Link 
                to="/cart" 
                className={`nav-link ${isActive('/cart')}`}
                onClick={closeMenu}
              >
                Panier
              </Link>
            </div>
          </nav>

          {/* Actions Header */}
          <div className="header-actions">
            <button className="btn-language">
              <span className="language-icon">🌐</span>
              <span>English</span>
            </button>

            <Link to="/profile" className="btn-profile">
              <span className="profile-icon">👤</span>
            </Link>

            <Link to="/cart" className="btn-cart">
              <span className="cart-icon">🛒</span>
              <span className="cart-badge">3</span>
            </Link>

            <Link to="/login" className="btn-login">
              <span className="login">Log In</span>
            </Link>


            {/* Menu burger pour mobile */}
            <button 
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;