import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FlightDetails.css';
import searchService from '../services/searchService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlightDetails();
  }, [id]);

  const loadFlightDetails = async () => {
    try {
      const data = await searchService.getFlightDetails(id);
      setFlight(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    navigate(`/booking/flights/${id}`);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: flight.id,
      type: 'flight',
      ...flight,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Vol ajouté au panier !');
  };

  if (isLoading) return <LoadingSpinner text="Chargement des détails du vol..." />;
  
  if (!flight) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Vol non trouvé</h2>
        <p>Le vol que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <button onClick={() => navigate('/search')} className="btn btn-primary">
          Retour à la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="flight-details-page">
      <div className="container">
        {/* En-tête */}
        <div className="details-header">
          <div className="header-left">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Retour
            </button>
            <div className="header-info">
              <h1 className="route-title">{flight.from} → {flight.to}</h1>
              <p className="flight-date">{flight.date || 'Date non spécifiée'}</p>
            </div>
          </div>
          <div className="price-badge">
            <span className="price-amount">{flight.price} DT</span>
            <span className="price-label">par personne</span>
          </div>
        </div>

        <div className="details-content">
          {/* Section Compagnie */}
          <section className="details-card">
            <div className="card-icon">✈️</div>
            <h2 className="card-title">Informations du vol</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Compagnie aérienne</span>
                <div className="info-value-with-logo">
                  <img 
                    src={flight.airlineLogo || 'https://via.placeholder.com/40'} 
                    alt={flight.airline} 
                    className="airline-logo-small"
                  />
                  <span className="info-value">{flight.airline || 'Non spécifié'}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Numéro de vol</span>
                <span className="info-value">{flight.flightNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Durée du vol</span>
                <span className="info-value">{flight.duration || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Classe</span>
                <span className="info-value info-value-highlight">
                  {flight.class === 'economy' ? 'Économique' : 
                   flight.class === 'business' ? 'Affaires' : 
                   flight.class === 'first' ? 'Première classe' : 
                   flight.class || 'Économique'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Escales</span>
                <span className="info-value">
                  {flight.stops === 0 ? 'Vol direct' : `${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Type d'appareil</span>
                <span className="info-value">{flight.aircraft || 'Boeing 737'}</span>
              </div>
            </div>
          </section>

          {/* Section Itinéraire */}
          <section className="details-card">
            <div className="card-icon">🗺️</div>
            <h2 className="card-title">Itinéraire détaillé</h2>
            <div className="itinerary">
              <div className="itinerary-point departure">
                <div className="point-marker">
                  <div className="marker-icon">🛫</div>
                </div>
                <div className="point-content">
                  <div className="point-time">{flight.departureTime || '08:00'}</div>
                  <div className="point-location">{flight.from}</div>
                  <div className="point-details">
                    <span className="airport-code">{flight.fromCode || 'TUN'}</span>
                    <span className="airport-name">{flight.fromAirport || 'Aéroport International'}</span>
                  </div>
                </div>
              </div>

              <div className="itinerary-line">
                <div className="line-content">
                  <span className="line-duration">{flight.duration || '2h 30m'}</span>
                </div>
              </div>

              {flight.stops > 0 && (
                <>
                  <div className="itinerary-point stopover">
                    <div className="point-marker">
                      <div className="marker-icon">⏱️</div>
                    </div>
                    <div className="point-content">
                      <div className="point-location">Escale</div>
                      <div className="point-details">
                        <span className="stopover-duration">Durée: 2h 15m</span>
                      </div>
                    </div>
                  </div>
                  <div className="itinerary-line">
                    <div className="line-content"></div>
                  </div>
                </>
              )}

              <div className="itinerary-point arrival">
                <div className="point-marker">
                  <div className="marker-icon">🛬</div>
                </div>
                <div className="point-content">
                  <div className="point-time">{flight.arrivalTime || '10:30'}</div>
                  <div className="point-location">{flight.to}</div>
                  <div className="point-details">
                    <span className="airport-code">{flight.toCode || 'CDG'}</span>
                    <span className="airport-name">{flight.toAirport || 'Aéroport International'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Services */}
          <section className="details-card">
            <div className="card-icon">🎁</div>
            <h2 className="card-title">Services inclus</h2>
            <div className="services-grid">
              {(flight.amenities || [
                'Bagage cabine (8kg)',
                'Bagage en soute (23kg)',
                'Repas à bord',
                'Boissons',
                'Divertissement',
                'WiFi disponible'
              ]).map((service, index) => (
                <div key={index} className="service-item">
                  <span className="service-check">✓</span>
                  <span className="service-text">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section Politique */}
          <section className="details-card">
            <div className="card-icon">📋</div>
            <h2 className="card-title">Politique de modification et annulation</h2>
            <div className="policy-list">
              <div className="policy-item">
                <div className="policy-icon success">✓</div>
                <div className="policy-content">
                  <h4>Modification gratuite</h4>
                  <p>Changement de date possible jusqu'à 24h avant le départ</p>
                </div>
              </div>
              <div className="policy-item">
                <div className="policy-icon warning">⚠️</div>
                <div className="policy-content">
                  <h4>Annulation avec frais</h4>
                  <p>Annulation possible avec frais de 50 DT jusqu'à 48h avant le départ</p>
                </div>
              </div>
              <div className="policy-item">
                <div className="policy-icon info">ℹ️</div>
                <div className="policy-content">
                  <h4>Remboursement</h4>
                  <p>Remboursement à 80% si annulation plus de 7 jours avant le départ</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Avis */}
          <section className="details-card">
            <div className="card-icon">⭐</div>
            <h2 className="card-title">Avis des voyageurs</h2>
            <div className="rating-summary">
              <div className="rating-score">
                <div className="score-number">{flight.rating || 4.5}</div>
                <div className="score-stars">{'⭐'.repeat(Math.floor(flight.rating || 4))}</div>
                <div className="score-text">Excellent</div>
              </div>
              <div className="rating-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Confort</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{width: '90%'}}></div>
                  </div>
                  <span className="breakdown-value">4.5</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Ponctualité</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{width: '85%'}}></div>
                  </div>
                  <span className="breakdown-value">4.3</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Service</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{width: '95%'}}></div>
                  </div>
                  <span className="breakdown-value">4.8</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/reviews/flights/${id}`)} 
              className="btn btn-secondary"
            >
              Voir tous les avis ({flight.reviewsCount || 0})
            </button>
          </section>
        </div>

        {/* Actions de réservation */}
        <div className="booking-actions-sticky">
          <div className="actions-content">
            <div className="actions-price">
              <span className="actions-price-amount">{flight.price} DT</span>
              <span className="actions-price-label">par personne</span>
            </div>
            <div className="actions-buttons">
              <button onClick={handleAddToCart} className="btn btn-secondary">
                Ajouter au panier
              </button>
              <button onClick={handleBooking} className="btn btn-primary">
                Réserver maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightDetails;