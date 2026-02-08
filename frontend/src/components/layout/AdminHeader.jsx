import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Header.css';

function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    closeMenu();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/admin" className="logo" onClick={closeMenu}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">TravelHub</span>
            <span className="admin-badge-logo">ADMIN</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className={`navigation ${menuOpen ? 'open' : ''}`}>

            {/* Liens mobile uniquement */}
            <div className="mobile-only-links">
              <Link 
                to="/admin" 
                className={`nav-link nav-link-admin ${isActive('/admin')}`}
                onClick={closeMenu}
              >
                ⚡ Admin Panel
              </Link>
              <Link 
                to="/admin/users" 
                className={`nav-link ${isActive('/admin/users')}`}
                onClick={closeMenu}
              >
                👥 Gérer Utilisateurs
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`nav-link ${isActive('/admin/bookings')}`}
                onClick={closeMenu}
              >
                📅 Gérer Réservations
              </Link>
              <Link 
                to="/admin/reviews" 
                className={`nav-link ${isActive('/admin/reviews')}`}
                onClick={closeMenu}
              >
                ⭐ Modérer Avis
              </Link>
              <div className="dropdown-divider-mobile"></div>
              <Link 
                to="/profileAdmin" 
                className={`nav-link ${isActive('/profileAdmin')}`}
                onClick={closeMenu}
              >
                👤 Mon Profil
              </Link>
              <button onClick={handleLogout} className="nav-link logout-link">
                🚪 Déconnexion
              </button>
            </div>
          </nav>

          {/* Actions Header */}
          <div className="header-actions">
            <button className="btn-language">
              <span className="language-icon">🌐</span>
              <span>Français</span>
            </button>

            {/* Dropdown Profile Admin */}
            <div className="user-dropdown">
              <button className="btn-profile-admin">
                <span className="profile-icon">👤</span>
                <span className="user-name">{user?.firstName}</span>
                <span className="admin-badge">ADMIN</span>
              </button>
              
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="dropdown-user-email">{user?.email}</p>
                  <span className="dropdown-admin-badge">Administrateur</span>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-section-title">Administration</div>
                <Link to="/admin" className="dropdown-item dropdown-item-admin" onClick={closeMenu}>
                  <span className="dropdown-icon">⚡</span>
                  Dashboard Admin
                </Link>
                <Link to="/admin/users" className="dropdown-item dropdown-item-admin" onClick={closeMenu}>
                  <span className="dropdown-icon">👥</span>
                  Gérer Utilisateurs
                </Link>
                <Link to="/admin/bookings" className="dropdown-item dropdown-item-admin" onClick={closeMenu}>
                  <span className="dropdown-icon">📅</span>
                  Gérer Réservations
                </Link>
                <Link to="/admin/reviews" className="dropdown-item dropdown-item-admin" onClick={closeMenu}>
                  <span className="dropdown-icon">⭐</span>
                  Modérer Avis
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-section-title">Mon Compte</div>
                <Link to="/profileAdmin" className="dropdown-item" onClick={closeMenu}>
                  <span className="dropdown-icon">👤</span>
                  Mon Profil
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                  <span className="dropdown-icon">🚪</span>
                  Déconnexion
                </button>
              </div>
            </div>

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

export default AdminHeader;