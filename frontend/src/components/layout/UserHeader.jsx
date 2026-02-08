import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Header.css';

function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    authService.logout();
    closeMenu();
    navigate('/');
  };
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">TravelHub</span>
          </Link>

          {/* Navigation */}
          <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Accueil</Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>À propos</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={closeMenu}>Contact</Link>

            {/* Mobile links */}
            <div className="mobile-only-links">
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={closeMenu}>👤 Mon Profil</Link>
              <Link to="/booking-history" className={`nav-link ${isActive('/booking-history')}`} onClick={closeMenu}>📅 Mes Réservations</Link>
              <Link to="/preferences" className={`nav-link ${isActive('/preferences')}`} onClick={closeMenu}>⚙️ Préférences</Link>
              <Link to="/cart" className={`nav-link ${isActive('/cart')}`} onClick={closeMenu}>🛒 Panier</Link>
              <button onClick={handleLogout} className="nav-link logout-link">🚪 Déconnexion</button>
            </div>
          </nav>

          {/* Actions header */}
          <div className="header-actions">
            <button className="btn-language">
              <span className="language-icon">🌐</span> Français
            </button>

            <Link to="/cart" className="btn-cart">
              <span className="cart-icon">🛒</span>
              <span className="cart-badge">0</span>
            </Link>

            {/* Profile dropdown */}
            <div className="user-dropdown">
              <button className="btn-profile-user">
                <span className="profile-icon">👤</span>
                <span className="user-name">{user?.firstName}</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user?.firstName} {user?.lastName}</p>
                  <p className="dropdown-user-email">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={closeMenu}>👤 Mon Profil</Link>
                <Link to="/booking-history" className="dropdown-item" onClick={closeMenu}>📅 Mes Réservations</Link>
                <Link to="/preferences" className="dropdown-item" onClick={closeMenu}>⚙️ Préférences</Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">🚪 Déconnexion</button>
              </div>
            </div>

            {/* Mobile burger menu */}
            <button className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
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

export default UserHeader;
