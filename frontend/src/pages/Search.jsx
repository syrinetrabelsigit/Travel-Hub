import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import searchService from '../services/searchService';
import './Search.css';

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('flights');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // État pour les recherches de vols
  const [flightSearch, setFlightSearch] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  // État pour les recherches d'hôtels
  const [hotelSearch, setHotelSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  // État pour les recherches d'activités
  const [activitySearch, setActivitySearch] = useState({
    destination: '',
    date: '',
    category: 'all',
    participants: 1
  });

  // Récupérer les données du HeroSection au chargement
  useEffect(() => {
    if (location.state?.searchType) {
      setActiveTab(location.state.searchType);
    }

    if (location.state?.searchData) {
      const data = location.state.searchData;

      if (location.state.searchType === 'flights') {
        setFlightSearch({
          from: data.from || '',
          to: data.to || '',
          departDate: data.departure || '',
          returnDate: data.return || '',
          passengers: data.passengers || 1,
          class: 'economy'
        });
      } else if (location.state.searchType === 'hotels') {
        setHotelSearch({
          destination: data.destination || '',
          checkIn: data.checkIn || '',
          checkOut: data.checkOut || '',
          guests: data.passengers || 1,
          rooms: data.rooms || 1
        });
      } else if (location.state.searchType === 'activities') {
        setActivitySearch({
          destination: data.destination || '',
          date: data.date || '',
          category: data.activity || 'all',
          participants: data.passengers || 1
        });
      }
    }
  }, [location]);

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightSearch(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelSearch(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setActivitySearch(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔍 Recherche de vols avec:', flightSearch);
      
      // Appeler l'API via searchService
      const results = await searchService.searchFlights(flightSearch);
      
      console.log('✅ Résultats reçus:', results);
      
      // Naviguer vers la page de résultats avec les données
      navigate('/search/flights/results', {
        state: {
          results: results,
          searchParams: flightSearch
        }
      });
      
    } catch (err) {
      console.error('❌ Erreur de recherche:', err);
      setError(err.message || 'Erreur lors de la recherche des vols');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🏨 Recherche d\'hôtels avec:', hotelSearch);
      
      // Appeler l'API via searchService
      const results = await searchService.searchHotels(hotelSearch);
      
      console.log('✅ Résultats reçus:', results);
      
      // Naviguer vers la page de résultats avec les données
      navigate('/search/hotels/results', {
        state: {
          results: results,
          searchParams: hotelSearch
        }
      });
      
    } catch (err) {
      console.error('❌ Erreur de recherche:', err);
      setError(err.message || 'Erreur lors de la recherche des hôtels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🎯 Recherche d\'activités avec:', activitySearch);
      
      // Appeler l'API via searchService
      const results = await searchService.searchActivities(activitySearch);
      
      console.log('✅ Résultats reçus:', results);
      
      // Naviguer vers la page de résultats avec les données
      navigate('/search/activities/results', {
        state: {
          results: results,
          searchParams: activitySearch
        }
      });
      
    } catch (err) {
      console.error('❌ Erreur de recherche:', err);
      setError(err.message || 'Erreur lors de la recherche des activités');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <h1 className="search-hero-title">Trouvez votre prochaine aventure</h1>
          <p className="search-hero-subtitle">
            Comparez et réservez des vols, hôtels et activités aux meilleurs prix
          </p>
        </div>
      </div>

      <div className="search-container">
        <div className="container">
          <div className="search-card">
            {/* Messages d'erreur */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Tabs de navigation */}
            <div className="search-tabs">
              <button
                className={`search-tab ${activeTab === 'flights' ? 'active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                <span className="tab-icon">✈️</span>
                Vols
              </button>
              <button
                className={`search-tab ${activeTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                <span className="tab-icon">🏨</span>
                Hôtels
              </button>
              <button
                className={`search-tab ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <span className="tab-icon">🎯</span>
                Activités
              </button>
            </div>

            {/* Formulaire de recherche de vols */}
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSubmit} className="search-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="from" className="form-label">Départ</label>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      value={flightSearch.from}
                      onChange={handleFlightChange}
                      className="form-input"
                      placeholder="Ville ou aéroport"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="to" className="form-label">Destination</label>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      value={flightSearch.to}
                      onChange={handleFlightChange}
                      className="form-input"
                      placeholder="Ville ou aéroport"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="departDate" className="form-label">Date de départ</label>
                    <input
                      type="date"
                      id="departDate"
                      name="departDate"
                      value={flightSearch.departDate}
                      onChange={handleFlightChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="returnDate" className="form-label">Date de retour</label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={flightSearch.returnDate}
                      onChange={handleFlightChange}
                      className="form-input"
                      min={flightSearch.departDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passengers" className="form-label">Passagers</label>
                    <input
                      type="number"
                      id="passengers"
                      name="passengers"
                      value={flightSearch.passengers}
                      onChange={handleFlightChange}
                      className="form-input"
                      min="1"
                      max="9"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="class" className="form-label">Classe</label>
                    <select
                      id="class"
                      name="class"
                      value={flightSearch.class}
                      onChange={handleFlightChange}
                      className="form-select"
                    >
                      <option value="economy">Économique</option>
                      <option value="premium">Premium</option>
                      <option value="business">Affaires</option>
                      <option value="first">Première classe</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-search"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      Recherche en cours...
                    </>
                  ) : (
                    'Rechercher des vols'
                  )}
                </button>
              </form>
            )}

            {/* Formulaire de recherche d'hôtels */}
            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSubmit} className="search-form">
                <div className="form-grid">
                  <div className="form-group form-group-wide">
                    <label htmlFor="destination" className="form-label">Destination</label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={hotelSearch.destination}
                      onChange={handleHotelChange}
                      className="form-input"
                      placeholder="Ville, pays ou région"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkIn" className="form-label">Arrivée</label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={hotelSearch.checkIn}
                      onChange={handleHotelChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkOut" className="form-label">Départ</label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={hotelSearch.checkOut}
                      onChange={handleHotelChange}
                      className="form-input"
                      min={hotelSearch.checkIn || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="guests" className="form-label">Voyageurs</label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={hotelSearch.guests}
                      onChange={handleHotelChange}
                      className="form-input"
                      min="1"
                      max="10"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rooms" className="form-label">Chambres</label>
                    <input
                      type="number"
                      id="rooms"
                      name="rooms"
                      value={hotelSearch.rooms}
                      onChange={handleHotelChange}
                      className="form-input"
                      min="1"
                      max="5"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-search"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      Recherche en cours...
                    </>
                  ) : (
                    'Rechercher des hôtels'
                  )}
                </button>
              </form>
            )}

            {/* Formulaire de recherche d'activités */}
            {activeTab === 'activities' && (
              <form onSubmit={handleActivitySubmit} className="search-form">
                <div className="form-grid">
                  <div className="form-group form-group-wide">
                    <label htmlFor="activityDestination" className="form-label">Destination</label>
                    <input
                      type="text"
                      id="activityDestination"
                      name="destination"
                      value={activitySearch.destination}
                      onChange={handleActivityChange}
                      className="form-input"
                      placeholder="Ville ou région"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="activityDate" className="form-label">Date</label>
                    <input
                      type="date"
                      id="activityDate"
                      name="date"
                      value={activitySearch.date}
                      onChange={handleActivityChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category" className="form-label">Catégorie</label>
                    <select
                      id="category"
                      name="category"
                      value={activitySearch.category}
                      onChange={handleActivityChange}
                      className="form-select"
                    >
                      <option value="all">Toutes</option>
                      <option value="culture">Culture & Patrimoine</option>
                      <option value="adventure">Aventure</option>
                      <option value="food">Gastronomie</option>
                      <option value="nature">Nature</option>
                      <option value="entertainment">Divertissement</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="participants" className="form-label">Participants</label>
                    <input
                      type="number"
                      id="participants"
                      name="participants"
                      value={activitySearch.participants}
                      onChange={handleActivityChange}
                      className="form-input"
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-search"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      Recherche en cours...
                    </>
                  ) : (
                    'Rechercher des activités'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Section avantages */}
          <div className="search-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3 className="benefit-title">Meilleurs prix garantis</h3>
              <p className="benefit-text">Nous comparons des centaines de sites</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3 className="benefit-title">Réservation instantanée</h3>
              <p className="benefit-text">Confirmez en quelques clics</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3 className="benefit-title">Paiement sécurisé</h3>
              <p className="benefit-text">Vos données sont protégées</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3 className="benefit-title">Sans frais cachés</h3>
              <p className="benefit-text">Prix transparents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;