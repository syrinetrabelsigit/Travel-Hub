import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // AJOUT
import './HeroSection.css';

function HeroSection() {
  const navigate = useNavigate(); // AJOUT
  const [searchType, setSearchType] = useState('flights');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    checkIn: '',
    checkOut: '',
    rooms: 1,
    destination: '',
    date: '',
    activity: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchType, searchData);
    
    // MODIFIÉ : Redirection vers VOTRE page de recherche avec les paramètres
    navigate('/search', { 
      state: { 
        searchType,
        searchData 
      } 
    });
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title">
              Découvrez le monde avec <span className="highlight">TravelHub</span>
            </h1>
            <p className="hero-subtitle">
              Réservez vos vols, hôtels et activités en un seul endroit. 
              Comparez les prix et trouvez les meilleures offres pour votre prochain voyage.
            </p>
          </div>

          {/* Search Box */}
          <div className="search-box">
            {/* Search Type Tabs */}
            <div className="search-tabs">
              <button 
                className={`search-tab ${searchType === 'flights' ? 'active' : ''}`}
                onClick={() => setSearchType('flights')}
              >
                <span className="tab-icon">✈️</span>
                <span>Vols</span>
              </button>
              <button 
                className={`search-tab ${searchType === 'hotels' ? 'active' : ''}`}
                onClick={() => setSearchType('hotels')}
              >
                <span className="tab-icon">🏨</span>
                <span>Hôtels</span>
              </button>
              <button 
                className={`search-tab ${searchType === 'activities' ? 'active' : ''}`}
                onClick={() => setSearchType('activities')}
              >
                <span className="tab-icon">🎯</span>
                <span>Activités</span>
              </button>
            </div>

            {/* Search Form */}
            <form className="search-form" onSubmit={handleSearch}>
              {/* Formulaire VOLS */}
              {searchType === 'flights' && (
                <div className="form-grid flights-form">
                  <div className="form-group">
                    <label htmlFor="from">
                      <span className="label-icon">📍</span>
                      Départ
                    </label>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      placeholder="Ville ou aéroport"
                      value={searchData.from}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="to">
                      <span className="label-icon">📍</span>
                      Destination
                    </label>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      placeholder="Ville ou aéroport"
                      value={searchData.to}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="departure">
                      <span className="label-icon">📅</span>
                      Date de départ
                    </label>
                    <input
                      type="date"
                      id="departure"
                      name="departure"
                      value={searchData.departure}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="return">
                      <span className="label-icon">📅</span>
                      Date de retour
                    </label>
                    <input
                      type="date"
                      id="return"
                      name="return"
                      value={searchData.return}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passengers">
                      <span className="label-icon">👥</span>
                      Passagers
                    </label>
                    <select
                      id="passengers"
                      name="passengers"
                      value={searchData.passengers}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <option key={num} value={num}>{num} passager{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group submit-group">
                    <button type="submit" className="btn-search">
                      <span className="search-icon">🔍</span>
                      <span>Rechercher</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire HÔTELS */}
              {searchType === 'hotels' && (
                <div className="form-grid hotels-form">
                  <div className="form-group">
                    <label htmlFor="destination">
                      <span className="label-icon">📍</span>
                      Destination
                    </label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      placeholder="Ville, région ou pays"
                      value={searchData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkIn">
                      <span className="label-icon">📅</span>
                      Arrivée
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={searchData.checkIn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkOut">
                      <span className="label-icon">📅</span>
                      Départ
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={searchData.checkOut}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rooms">
                      <span className="label-icon">🛏️</span>
                      Chambres
                    </label>
                    <select
                      id="rooms"
                      name="rooms"
                      value={searchData.rooms}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} chambre{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="passengers">
                      <span className="label-icon">👥</span>
                      Voyageurs
                    </label>
                    <select
                      id="passengers"
                      name="passengers"
                      value={searchData.passengers}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} voyageur{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group submit-group">
                    <button type="submit" className="btn-search">
                      <span className="search-icon">🔍</span>
                      <span>Rechercher</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire ACTIVITÉS */}
              {searchType === 'activities' && (
                <div className="form-grid activities-form">
                  <div className="form-group">
                    <label htmlFor="destination">
                      <span className="label-icon">📍</span>
                      Destination
                    </label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      placeholder="Ville, région ou pays"
                      value={searchData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">
                      <span className="label-icon">📅</span>
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={searchData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="activity">
                      <span className="label-icon">🎯</span>
                      Type d'activité
                    </label>
                    <select
                      id="activity"
                      name="activity"
                      value={searchData.activity}
                      onChange={handleInputChange}
                    >
                      <option value="">Toutes les activités</option>
                      <option value="culture">Culture & Visites</option>
                      <option value="adventure">Aventure</option>
                      <option value="food">Gastronomie</option>
                      <option value="sport">Sport & Loisirs</option>
                      <option value="nature">Nature & Randonnée</option>
                      <option value="relaxation">Détente & Bien-être</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="passengers">
                      <span className="label-icon">👥</span>
                      Participants
                    </label>
                    <select
                      id="passengers"
                      name="passengers"
                      value={searchData.passengers}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group submit-group activities-submit">
                    <button type="submit" className="btn-search">
                      <span className="search-icon">🔍</span>
                      <span>Rechercher</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <h3 className="stat-number">200+</h3>
                <p className="stat-label">Destinations</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✈️</div>
              <div className="stat-content">
                <h3 className="stat-number">5000+</h3>
                <p className="stat-label">Vols par jour</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-number">50k+</h3>
                <p className="stat-label">Clients satisfaits</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏨</div>
              <div className="stat-content">
                <h3 className="stat-number">1000+</h3>
                <p className="stat-label">Hôtels partenaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;