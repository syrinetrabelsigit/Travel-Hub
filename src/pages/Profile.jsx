import React, { useState } from 'react';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Syrine',
    lastName: 'Trabelsi',
    email: 'syrine.trabelsi@example.com',
    phone: '+216 12 345 678',
    dateOfBirth: '1998-05-15',
    nationality: 'Tunisienne',
    address: '123 Avenue Habib Bourguiba',
    city: 'Tunis',
    zipCode: '1000',
    country: 'Tunisie'
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Annuler les modifications
      setEditData({ ...userData });
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

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
              <button className="btn-change-avatar">
                <span className="camera-icon">📷</span>
              </button>
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{userData.firstName} {userData.lastName}</h1>
              <p className="profile-email">{userData.email}</p>
              <div className="profile-badges">
                <span className="badge badge-verified">✓ Vérifié</span>
                <span className="badge badge-member">Membre depuis 2024</span>
              </div>
            </div>
          </div>
          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="btn-edit" onClick={handleEditToggle}>
                <span className="edit-icon">✏️</span>
                Modifier le profil
              </button>
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
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-grid">
            {/* Informations personnelles */}
            <div className="profile-section">
              <h2 className="section-title">
                <span className="title-icon">📝</span>
                Informations personnelles
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.firstName}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.lastName}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.email}</p>
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
                    />
                  ) : (
                    <p>{userData.phone}</p>
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
                    <p>{new Date(userData.dateOfBirth).toLocaleDateString('fr-FR')}</p>
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
                    />
                  ) : (
                    <p>{userData.nationality}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="profile-section">
              <h2 className="section-title">
                <span className="title-icon">📍</span>
                Adresse
              </h2>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Adresse</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.address}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Ville</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editData.city}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.city}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Code postal</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={editData.zipCode}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  ) : (
                    <p>{userData.zipCode}</p>
                  )}
                </div>

                <div className="info-item full-width">
                  <label>Pays</label>
                  {isEditing ? (
                    <select
                      name="country"
                      value={editData.country}
                      onChange={handleChange}
                      className="input-edit"
                    >
                      <option value="Tunisie">Tunisie</option>
                      <option value="France">France</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Algérie">Algérie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  ) : (
                    <p>{userData.country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">✈️</div>
              <div className="stat-content">
                <h3 className="stat-number">12</h3>
                <p className="stat-label">Voyages réalisés</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <h3 className="stat-number">8</h3>
                <p className="stat-label">Pays visités</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-number">4.8</h3>
                <p className="stat-label">Note moyenne</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-number">2,450DT</h3>
                <p className="stat-label">Économies réalisées</p>
              </div>
            </div>
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
              <button className="action-card action-button">
                <span className="action-icon">🔒</span>
                <span className="action-text">Changer le mot de passe</span>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;