import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, authService } from '../services';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  nationality: '',
  role: 'USER'
  });


  const [editData, setEditData] = useState({ ...userData });
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  const [userStats, setUserStats] = useState({
    totalTrips: 0,
    visitedCountries: 0,
    averageRating: 0,
    totalSavings: 0
  });

  // Charger les données du profil et statistiques
  useEffect(() => {
    fetchProfile();
    fetchUserStats();
    
    // S'abonner aux mises à jour
    const unsubscribe = userService.onProfileUpdate((updatedUser) => {
      setUserData(updatedUser);
      setEditData(updatedUser);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profile = await userService.getProfile();
      
      // Formater les données pour correspondre au modèle
      const formattedData = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        nationality: profile.nationality || '',
        role: profile.role || 'USER'
      };

      
      setUserData(formattedData);
      setEditData(formattedData);
      
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Impossible de charger les données du profil. Utilisation des données locales.');
      
      // Fallback aux données locales
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUserData(prev => ({ ...prev, ...storedUser }));
        setEditData(prev => ({ ...prev, ...storedUser }));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const stats = await userService.getUserStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Erreur stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Annuler les modifications
      setEditData({ ...userData });
      setError('');
      setSuccessMessage('');
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      // Valider les données obligatoires
      if (!editData.firstName.trim() || !editData.lastName.trim() || !editData.email.trim()) {
        setError('Les champs Prénom, Nom et Email sont obligatoires');
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        setError('Veuillez entrer un email valide');
        return;
      }

      // Préparer les données pour l'API
     const profileUpdateData = {
      firstName: editData.firstName.trim(),
      lastName: editData.lastName.trim(),
      email: editData.email.trim(),
      phone: editData.phone.trim(),
      dateOfBirth: editData.dateOfBirth,
      nationality: editData.nationality.trim()
    };


      const updatedUser = await userService.updateProfile(profileUpdateData);
      
      setUserData(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profil mis à jour avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
 const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

   const handlePasswordSave = async () => {
      try {
        setError('');
        setSuccessMessage('');
  
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setError('Les nouveaux mots de passe ne correspondent pas');
          return;
        }
  
        if (passwordData.newPassword.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
  
        await userService.changePassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
  
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
  
        setSuccessMessage('Mot de passe changé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Erreur changement mot de passe:', err);
        setError(err.message || 'Erreur lors du changement de mot de passe');
      }
    };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement de votre profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Messages d'erreur/succès */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <span className="avatar-icon">
                {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '👤'}
              </span>
              {isEditing && (
                <button className="btn-change-avatar">
                  <span className="camera-icon">📷</span>
                </button>
              )}
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">
                {userData.firstName || 'Utilisateur'} {userData.lastName || ''}
              </h1>
              <p className="profile-email">{userData.email || 'Non renseigné'}</p>
              <div className="profile-badges">
                <span className={`badge ${userData.role === 'ADMIN' ? 'badge-admin' : 'badge-verified'}`}>
                  {userData.role === 'ADMIN' ? '👑 ADMIN' : '✓ Vérifié'}
                </span>
                <span className="badge badge-member">
                  Membre depuis {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-header-actions">
            {!isEditing ? (
              <div className="header-actions-group">
                <button className="btn-edit" onClick={handleEditToggle}>
                  <span className="edit-icon">✏️</span>
                  Modifier le profil
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                  <span className="logout-icon">🚪</span>
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="edit-actions">
                <button className="btn-cancel" onClick={handleEditToggle}>
                  Annuler
                </button>
                <button className="btn-save" onClick={handleSave}>
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          <a href="/profile" className="profile-nav-link active">
            <span className="nav-icon">👤</span>
            Informations personnelles
          </a>
          <a href="/booking-history" className="profile-nav-link">
            <span className="nav-icon">📋</span>
            Mes réservations
          </a>
          <a href="/preferences" className="profile-nav-link">
            <span className="nav-icon">⚙️</span>
            Préférences
          </a>
          <a href="/travelers" className="profile-nav-link">
            <span className="nav-icon">👥</span>
            Voyageurs fréquents
          </a>
        </div>

         {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-grid">
            {/* Informations personnelles */}
            <div className="profile-section">
              <h2 className="section-title">
                <span className="title-icon">👑</span>
                Informations Administrateur
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Prénom *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleChange}
                      className="input-edit"
                      required
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <p className="info-value">{userData.firstName || 'Non renseigné'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Nom *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleChange}
                      className="input-edit"
                      required
                      placeholder="Votre nom"
                    />
                  ) : (
                    <p className="info-value">{userData.lastName || 'Non renseigné'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Email *</label>
                  {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        className="input-edit"
                        required
                        placeholder="admin@travelhub.com"
                        disabled // ⚡ l’email n’est pas modifiable
                        />

                  ) : (
                    <p className="info-value">{userData.email || 'Non renseigné'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="input-edit"
                      placeholder="+216 12 345 678"
                    />
                  ) : (
                    <p className="info-value">{userData.phone || 'Non renseigné'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Date de naissance</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editData.dateOfBirth}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p className="info-value">{formatDate(userData.dateOfBirth)}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Nationalité</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nationality"
                      value={editData.nationality}
                      onChange={handleChange}
                      className="input-edit"
                      placeholder="Votre nationalité"
                    />
                  ) : (
                    <p className="info-value">{userData.nationality || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="password-section">
              <h2 className="section-title">
                <span className="title-icon">🔒</span>
                Sécurité du compte
              </h2>
              <div className="password-input-group">
                <div className="password-input-item">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-edit"
                    placeholder="••••••••"
                  />
                </div>

                <div className="password-input-item">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-edit"
                    placeholder="••••••••"
                  />
                </div>

                <div className="password-input-item">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-edit"
                    placeholder="••••••••"
                  />
                </div>

                <button className="change-password-btn" onClick={handlePasswordSave}>
                  <span className="action-icon">🔐</span>
                  <span className="action-text">Mettre à jour le mot de passe</span>
                  <span className="action-arrow">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="profile-stats">
            {loadingStats ? (
              <div className="stats-loading">Chargement des statistiques...</div>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-icon">✈️</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{userStats.totalTrips}</h3>
                    <p className="stat-label">Voyages réalisés</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🌍</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{userStats.visitedCountries}</h3>
                    <p className="stat-label">Pays visités</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{userStats.averageRating.toFixed(1)}</h3>
                    <p className="stat-label">Note moyenne</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{formatCurrency(userStats.totalSavings)}</h3>
                    <p className="stat-label">Économies réalisées</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions rapides */}
          <div className="quick-actions">
            <h2 className="section-title">Actions rapides</h2>
            <div className="actions-grid">
              <a href="/booking-history" className="action-card">
                <span className="action-icon">📋</span>
                <span className="action-text">Voir mes réservations</span>
                <span className="action-arrow">→</span>
              </a>
              <a href="/preferences" className="action-card">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Modifier mes préférences</span>
                <span className="action-arrow">→</span>
              </a>
              <a href="/cart" className="action-card">
                <span className="action-icon">🛒</span>
                <span className="action-text">Mon panier</span>
                <span className="action-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;