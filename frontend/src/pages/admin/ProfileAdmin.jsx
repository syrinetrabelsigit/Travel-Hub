import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, authService } from '../../services';
import './ProfileAdmin.css';

function ProfileAdmin() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: ''
  });

  const [editData, setEditData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
  try {
    setLoading(true);
    setError('');
    const profile = await userService.getProfile();

    const formattedData = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth || '',
      nationality: profile.nationality || ''
    };

    setUserData(formattedData);
    setEditData(formattedData);
  } catch (err) {
    console.error('Erreur chargement profil:', err);

    // On tente de récupérer les infos depuis authService
    const storedUser = authService.getCurrentUser();
    console.log(storedUser);
    if (storedUser) {
      setUserData(storedUser);
      setEditData(storedUser);

      // Ne PAS afficher d'erreur si on a récupéré des données locales
      setError('');
    } else {
      // Si aucune donnée dispo, afficher l'erreur
      setError('Impossible de charger le profil.');
    }
  } finally {
    setLoading(false);
  }
};


  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData });
      setError('');
      setSuccessMessage('');
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    try {
        setError('');
        setSuccessMessage('');

        const profileUpdateData = {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        phone: editData.phone.trim(),
        dateOfBirth: editData.dateOfBirth,
        nationality: editData.nationality.trim()
        };

        const updatedUser = await userService.updateProfile(profileUpdateData);

        setUserData(updatedUser);
        setEditData(updatedUser);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
    } catch (err) {
    console.error("Erreur complète :", err);
    console.log("Response data :", err.response?.data);  
    setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="profile-admin-page">
        <div className="container">
          <div className="pap-loading-spinner">
            <div className="pap-spinner"></div>
            <p>Chargement du profil admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-admin-page">
      <div className="container">
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
        {/* Header exactement comme le profil utilisateur */}
        <div className="profile-header">
        <div className="profile-header-content">
            <div className="profile-avatar">
            <span className="avatar-icon">
                {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 'A'}
            </span>
            {isEditing && (
                <button className="btn-change-avatar">
                <span className="camera-icon">📷</span>
                </button>
            )}
            </div>
            <div className="profile-header-info">
            <h1 className="profile-name">
                {userData.firstName || 'Admin'} {userData.lastName || ''}
            </h1>
            <p className="profile-email">{userData.email || 'admin@travelhub.com'}</p>
            <div className="profile-badges">
                <span className="badge badge-admin">👑 ADMIN</span>
                <span className="badge badge-member">Membre depuis {new Date().getFullYear()}</span>
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
        {/* Navigation */}
        <div className="profile-nav">
          <a href="/profileAdmin" className="profile-nav-link active">
            <span className="nav-icon">👤</span>
            Mon profil
          </a>
          <a href="/admin" className="profile-nav-link">
            <span className="nav-icon">📊</span>
            Tableau de bord
          </a>
          <a href="/admin/users" className="profile-nav-link">
            <span className="nav-icon">👥</span>
            Utilisateurs
          </a>
          <a href="/admin/bookings" className="profile-nav-link">
            <span className="nav-icon">📋</span>
            Réservations
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

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Actions rapides</h2>
            <div className="actions-grid">
              <a href="/admin/dashboard" className="admin-action-card">
                <span className="action-icon">📊</span>
                <span className="action-text">Tableau de bord</span>
                <span className="action-arrow">→</span>
              </a>
              <a href="/admin/users" className="admin-action-card">
                <span className="action-icon">👥</span>
                <span className="action-text">Gérer les utilisateurs</span>
                <span className="action-arrow">→</span>
              </a>
              <a href="/admin/bookings" className="admin-action-card">
                <span className="action-icon">📋</span>
                <span className="action-text">Voir les réservations</span>
                <span className="action-arrow">→</span>
              </a>
              <a href="/admin/reviews" className="admin-action-card">
                <span className="action-icon">⭐</span>
                <span className="action-text">Modérer les avis</span>
                <span className="action-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;