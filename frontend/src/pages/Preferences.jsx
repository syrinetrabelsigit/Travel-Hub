import React, { useState, useEffect } from 'react';
import preferencesService from '../services/preferencesService';
import './Preferences.css';

function Preferences() {
  const [preferences, setPreferences] = useState({
    travelClass: 'economy',
    seatPreference: 'window',
    mealPreference: 'standard',
    hotelStars: [3, 4, 5],
    roomType: 'double',
    hotelAmenities: ['wifi', 'breakfast', 'parking'],
    budgetMin: 0,
    budgetMax: 5000,
    preferredAirlines: ['Air France', 'Emirates'],
    destinations: ['Europe', 'Asie'],
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: true,
    promotions: true,
    newsletter: true,
    language: 'fr',
    currency: 'EUR'
  });

  const [frequentTravelers, setFrequentTravelers] = useState([]);
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [newTraveler, setNewTraveler] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    passportNumber: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Charger les préférences au démarrage
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await preferencesService.getPreferences();
     
      // Fusionner avec les valeurs par défaut
      setPreferences(prevPrefs => ({
        ...prevPrefs,
        ...data
      }));
     
      // Charger les voyageurs fréquents
      if (data.frequentTravelers) {
        setFrequentTravelers(data.frequentTravelers);
      }
    } catch (error) {
      console.error('Erreur chargement préférences:', error);
      // On garde les valeurs par défaut si erreur
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (category, value) => {
    setPreferences({
      ...preferences,
      [category]: value
    });
  };

  const handleArrayToggle = (category, value) => {
    const currentArray = preferences[category];
    if (currentArray.includes(value)) {
      setPreferences({
        ...preferences,
        [category]: currentArray.filter(item => item !== value)
      });
    } else {
      setPreferences({
        ...preferences,
        [category]: [...currentArray, value]
      });
    }
  };

  const handleAddTraveler = async () => {
    if (newTraveler.firstName && newTraveler.lastName) {
      try {
        // Ajouter localement
        const updatedTravelers = [
          ...frequentTravelers,
          { ...newTraveler, id: Date.now() }
        ];
        setFrequentTravelers(updatedTravelers);

        // Sauvegarder sur le backend
        await preferencesService.updatePreferences({
          ...preferences,
          frequentTravelers: updatedTravelers
        });

        setNewTraveler({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passportNumber: ''
        });
        setShowAddTraveler(false);
        alert('Voyageur ajouté avec succès !');
      } catch (error) {
        console.error('Erreur ajout voyageur:', error);
        alert('Erreur lors de l\'ajout du voyageur');
      }
    }
  };

  const handleRemoveTraveler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce voyageur ?')) {
      try {
        const updatedTravelers = frequentTravelers.filter(t => t.id !== id);
        setFrequentTravelers(updatedTravelers);

        // Sauvegarder sur le backend
        await preferencesService.updatePreferences({
          ...preferences,
          frequentTravelers: updatedTravelers
        });

        alert('Voyageur supprimé avec succès !');
      } catch (error) {
        console.error('Erreur suppression voyageur:', error);
        alert('Erreur lors de la suppression du voyageur');
      }
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await preferencesService.updatePreferences({
        ...preferences,
        frequentTravelers
      });

      alert('Préférences enregistrées avec succès ! ✅');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des préférences');
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="preferences-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement de vos préférences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Mes Préférences</h1>
            <p className="page-subtitle">
              Personnalisez votre expérience de voyage
            </p>
          </div>
          <button
            className="btn-save-all"
            onClick={handleSavePreferences}
            disabled={isSaving}
          >
            <span className="save-icon">💾</span>
            {isSaving ? 'Enregistrement...' : 'Enregistrer tout'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="preferences-content">
          {/* Préférences de voyage */}
          <div className="pref-section">
            <h2 className="pref-section-title">
              <span className="section-icon">✈️</span>
              Préférences de vol
            </h2>
            <div className="pref-grid">
              <div className="pref-item">
                <label className="pref-label">Classe de voyage</label>
                <select
                  value={preferences.travelClass}
                  onChange={(e) => handlePreferenceChange('travelClass', e.target.value)}
                  className="pref-select"
                >
                  <option value="economy">Économique</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">Première Classe</option>
                </select>
              </div>

              <div className="pref-item">
                <label className="pref-label">Préférence de siège</label>
                <select
                  value={preferences.seatPreference}
                  onChange={(e) => handlePreferenceChange('seatPreference', e.target.value)}
                  className="pref-select"
                >
                  <option value="window">Fenêtre</option>
                  <option value="aisle">Couloir</option>
                  <option value="middle">Milieu</option>
                </select>
              </div>

              <div className="pref-item">
                <label className="pref-label">Préférence repas</label>
                <select
                  value={preferences.mealPreference}
                  onChange={(e) => handlePreferenceChange('mealPreference', e.target.value)}
                  className="pref-select"
                >
                  <option value="standard">Standard</option>
                  <option value="vegetarian">Végétarien</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal</option>
                  <option value="kosher">Casher</option>
                </select>
              </div>
            </div>
          </div>

          {/* Préférences d'hôtel */}
          <div className="pref-section">
            <h2 className="pref-section-title">
              <span className="section-icon">🏨</span>
              Préférences d'hôtel
            </h2>
            <div className="pref-grid">
              <div className="pref-item full-width">
                <label className="pref-label">Nombre d'étoiles</label>
                <div className="checkbox-group">
                  {[1, 2, 3, 4, 5].map(star => (
                    <label key={star} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={preferences.hotelStars.includes(star)}
                        onChange={() => handleArrayToggle('hotelStars', star)}
                      />
                      <span>{star} {'⭐'.repeat(star)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pref-item">
                <label className="pref-label">Type de chambre</label>
                <select
                  value={preferences.roomType}
                  onChange={(e) => handlePreferenceChange('roomType', e.target.value)}
                  className="pref-select"
                >
                  <option value="single">Simple</option>
                  <option value="double">Double</option>
                  <option value="twin">Twin</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="pref-item full-width">
                <label className="pref-label">Équipements souhaités</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.hotelAmenities.includes('wifi')}
                      onChange={() => handleArrayToggle('hotelAmenities', 'wifi')}
                    />
                    <span>WiFi gratuit</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.hotelAmenities.includes('breakfast')}
                      onChange={() => handleArrayToggle('hotelAmenities', 'breakfast')}
                    />
                    <span>Petit-déjeuner</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.hotelAmenities.includes('parking')}
                      onChange={() => handleArrayToggle('hotelAmenities', 'parking')}
                    />
                    <span>Parking</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.hotelAmenities.includes('pool')}
                      onChange={() => handleArrayToggle('hotelAmenities', 'pool')}
                    />
                    <span>Piscine</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.hotelAmenities.includes('gym')}
                      onChange={() => handleArrayToggle('hotelAmenities', 'gym')}
                    />
                    <span>Salle de sport</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="pref-section">
            <h2 className="pref-section-title">
              <span className="section-icon">💰</span>
              Budget préférentiel
            </h2>
            <div className="pref-grid">
              <div className="pref-item">
                <label className="pref-label">Budget minimum (DT)</label>
                <input
                  type="number"
                  value={preferences.budgetMin}
                  onChange={(e) => handlePreferenceChange('budgetMin', Number(e.target.value))}
                  className="pref-input"
                  min="0"
                />
              </div>
              <div className="pref-item">
                <label className="pref-label">Budget maximum (DT)</label>
                <input
                  type="number"
                  value={preferences.budgetMax}
                  onChange={(e) => handlePreferenceChange('budgetMax', Number(e.target.value))}
                  className="pref-input"
                  min="0"
                />
              </div>
            </div>
            <div className="budget-display">
              Budget : {preferences.budgetMin}DT - {preferences.budgetMax}DT
            </div>
          </div>

          {/* Notifications */}
          <div className="pref-section">
            <h2 className="pref-section-title">
              <span className="section-icon">🔔</span>
              Notifications
            </h2>
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Notifications par email</h4>
                  <p className="toggle-description">Recevez les confirmations et rappels par email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Notifications SMS</h4>
                  <p className="toggle-description">Recevez des alertes importantes par SMS</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Alertes de prix</h4>
                  <p className="toggle-description">Soyez notifié des baisses de prix</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.priceAlerts}
                    onChange={(e) => handlePreferenceChange('priceAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Promotions et offres</h4>
                  <p className="toggle-description">Recevez nos meilleures offres et promotions</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.promotions}
                    onChange={(e) => handlePreferenceChange('promotions', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Newsletter</h4>
                  <p className="toggle-description">Recevez notre newsletter mensuelle</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.newsletter}
                    onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Voyageurs fréquents */}
          <div className="pref-section">
            <div className="section-header-with-action">
              <h2 className="pref-section-title">
                <span className="section-icon">👥</span>
                Voyageurs fréquents
              </h2>
              <button
                className="btn-add-traveler"
                onClick={() => setShowAddTraveler(!showAddTraveler)}
              >
                <span className="add-icon">+</span>
                Ajouter un voyageur
              </button>
            </div>

            {showAddTraveler && (
              <div className="add-traveler-form">
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={newTraveler.firstName}
                    onChange={(e) => setNewTraveler({ ...newTraveler, firstName: e.target.value })}
                    className="pref-input"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={newTraveler.lastName}
                    onChange={(e) => setNewTraveler({ ...newTraveler, lastName: e.target.value })}
                    className="pref-input"
                  />
                  <input
                    type="date"
                    placeholder="Date de naissance"
                    value={newTraveler.dateOfBirth}
                    onChange={(e) => setNewTraveler({ ...newTraveler, dateOfBirth: e.target.value })}
                    className="pref-input"
                  />
                  <input
                    type="text"
                    placeholder="Numéro de passeport"
                    value={newTraveler.passportNumber}
                    onChange={(e) => setNewTraveler({ ...newTraveler, passportNumber: e.target.value })}
                    className="pref-input"
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setShowAddTraveler(false)}>
                    Annuler
                  </button>
                  <button className="btn-confirm" onClick={handleAddTraveler}>
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            <div className="travelers-list">
              {frequentTravelers.length === 0 ? (
                <p className="empty-state">Aucun voyageur fréquent enregistré</p>
              ) : (
                frequentTravelers.map(traveler => (
                  <div key={traveler.id} className="traveler-card">
                    <div className="traveler-avatar">
                      <span className="traveler-icon">👤</span>
                    </div>
                    <div className="traveler-info">
                      <h4 className="traveler-name">
                        {traveler.firstName} {traveler.lastName}
                      </h4>
                      <p className="traveler-details">
                        Né(e) le {new Date(traveler.dateOfBirth).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="traveler-passport">
                        Passeport: {traveler.passportNumber}
                      </p>
                    </div>
                    <button
                      className="btn-remove-traveler"
                      onClick={() => handleRemoveTraveler(traveler.id)}
                    >
                      <span className="remove-icon">🗑️</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;
