import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HotelDetails.css';
import searchService from '../services/searchService';
import cartService from '../services/cartService';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadHotelDetails();
  }, [id]);

  const loadHotelDetails = async () => {
    try {
      const data = await searchService.getHotelDetails(id);
      setHotel(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      // Sauvegarder l'URL actuelle pour rediriger après connexion
      localStorage.setItem('redirectAfterLogin', `/booking/hotels/${id}`);
      navigate('/login');
      return;
    }
    
    // Si connecté, procéder à la réservation
    navigate(`/booking/hotels/${id}`);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: hotel.id,
      type: 'hotel',
      ...hotel,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Hôtel ajouté au panier !');
  };

  if (isLoading) return <LoadingSpinner text="Chargement des détails de l'hôtel..." />;
  
  if (!hotel) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Hôtel non trouvé</h2>
        <p>L'hôtel que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <button onClick={() => navigate('/search')} className="btn btn-primary">
          Retour à la recherche
        </button>
      </div>
    );
  }

  const images = hotel.images || [
    hotel.image || 'https://via.placeholder.com/800x500',
    'https://via.placeholder.com/800x500',
    'https://via.placeholder.com/800x500',
    'https://via.placeholder.com/800x500'
  ];

  return (
    <div className="hotel-details-page">
      <div className="container">
        {/* En-tête */}
        <div className="details-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Retour
          </button>
          <div className="header-info">
            <h1 className="hotel-name">{hotel.name}</h1>
            <div className="hotel-meta">
              <div className="hotel-stars">
                {'⭐'.repeat(hotel.stars || 4)}
              </div>
              <div className="hotel-location">
                📍 {hotel.location}
              </div>
              <div className="hotel-rating">
                <span className="rating-badge">{hotel.rating || 4.5}</span>
                <span className="rating-text">Excellent</span>
                <span className="rating-reviews">({hotel.reviewsCount || 0} avis)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="hotel-gallery">
          <div className="gallery-main">
            <img src={images[selectedImage]} alt={hotel.name} className="main-image" />
          </div>
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${hotel.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="hotel-content">
          <div className="content-main">
            {/* Description */}
            <section className="details-card">
              <div className="card-icon">📝</div>
              <h2 className="card-title">Description</h2>
              <p className="hotel-description">
                {hotel.description || 
                  "Cet hôtel élégant offre un cadre luxueux et confortable pour votre séjour. Situé dans un emplacement privilégié, il dispose de toutes les commodités modernes pour rendre votre visite inoubliable. Le personnel attentionné est à votre disposition pour répondre à tous vos besoins."}
              </p>
            </section>

            {/* Équipements */}
            <section className="details-card">
              <div className="card-icon">🏨</div>
              <h2 className="card-title">Équipements et services</h2>
              <div className="amenities-grid">
                {(hotel.amenities || [
                  'WiFi gratuit',
                  'Piscine',
                  'Restaurant',
                  'Spa & Wellness',
                  'Salle de sport',
                  'Parking gratuit',
                  'Service en chambre 24h/24',
                  'Climatisation',
                  'Bar',
                  'Concierge',
                  'Blanchisserie',
                  'Coffre-fort'
                ]).map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-check">✓</span>
                    <span className="amenity-text">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Chambres disponibles */}
            <section className="details-card">
              <div className="card-icon">🛏️</div>
              <h2 className="card-title">Types de chambres</h2>
              <div className="rooms-list">
                <div className="room-card">
                  <img src="https://via.placeholder.com/200x150" alt="Chambre Standard" />
                  <div className="room-info">
                    <h3>Chambre Standard</h3>
                    <p>Chambre confortable avec lit double, salle de bain privée</p>
                    <div className="room-features">
                      <span>👥 2 personnes</span>
                      <span>📏 25 m²</span>
                      <span>🛏️ 1 lit double</span>
                    </div>
                  </div>
                  <div className="room-price">
                    <span className="price">{hotel.pricePerNight || hotel.price} DT</span>
                    <span className="price-label">par nuit</span>
                  </div>
                </div>

                <div className="room-card">
                  <img src="https://via.placeholder.com/200x150" alt="Suite Deluxe" />
                  <div className="room-info">
                    <h3>Suite Deluxe</h3>
                    <p>Suite spacieuse avec salon séparé et vue panoramique</p>
                    <div className="room-features">
                      <span>👥 4 personnes</span>
                      <span>📏 45 m²</span>
                      <span>🛏️ 2 lits doubles</span>
                    </div>
                  </div>
                  <div className="room-price">
                    <span className="price">{(hotel.pricePerNight || hotel.price) * 1.5} DT</span>
                    <span className="price-label">par nuit</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Localisation */}
            <section className="details-card">
              <div className="card-icon">📍</div>
              <h2 className="card-title">Emplacement</h2>
              <p className="location-description">
                Idéalement situé à {hotel.location}, cet établissement offre un accès facile aux principales attractions de la ville.
              </p>
              <div className="nearby-places">
                <h4>Points d'intérêt à proximité:</h4>
                <ul>
                  <li>🏛️ Centre-ville - 2 km</li>
                  <li>🏖️ Plage - 500 m</li>
                  <li>✈️ Aéroport - 15 km</li>
                  <li>🚉 Gare - 3 km</li>
                </ul>
              </div>
            </section>

            {/* Règlement */}
            <section className="details-card">
              <div className="card-icon">📋</div>
              <h2 className="card-title">Règlement de l'hôtel</h2>
              <div className="hotel-rules">
                <div className="rule-item">
                  <span className="rule-label">Check-in:</span>
                  <span className="rule-value">À partir de 15h00</span>
                </div>
                <div className="rule-item">
                  <span className="rule-label">Check-out:</span>
                  <span className="rule-value">Jusqu'à 12h00</span>
                </div>
                <div className="rule-item">
                  <span className="rule-label">Annulation:</span>
                  <span className="rule-value">Gratuite jusqu'à 48h avant l'arrivée</span>
                </div>
                <div className="rule-item">
                  <span className="rule-label">Paiement:</span>
                  <span className="rule-value">Carte bancaire acceptée</span>
                </div>
                <div className="rule-item">
                  <span className="rule-label">Animaux:</span>
                  <span className="rule-value">Non autorisés</span>
                </div>
              </div>
            </section>

            {/* Avis */}
            <section className="details-card">
              <div className="card-icon">⭐</div>
              <h2 className="card-title">Avis des clients</h2>
              <div className="rating-summary">
                <div className="rating-score">
                  <div className="score-number">{hotel.rating || 4.5}</div>
                  <div className="score-text">Excellent</div>
                  <div className="score-count">{hotel.reviewsCount || 0} avis</div>
                </div>
                <div className="rating-categories">
                  <div className="category-item">
                    <span className="category-label">Propreté</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '95%'}}></div>
                    </div>
                    <span className="category-value">4.8</span>
                  </div>
                  <div className="category-item">
                    <span className="category-label">Confort</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '90%'}}></div>
                    </div>
                    <span className="category-value">4.5</span>
                  </div>
                  <div className="category-item">
                    <span className="category-label">Emplacement</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '92%'}}></div>
                    </div>
                    <span className="category-value">4.6</span>
                  </div>
                  <div className="category-item">
                    <span className="category-label">Personnel</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '96%'}}></div>
                    </div>
                    <span className="category-value">4.8</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/reviews/hotels/${id}`)} 
                className="btn btn-secondary"
              >
                Voir tous les avis
              </button>
            </section>
          </div>

          {/* Sidebar prix */}
          <aside className="booking-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-price">
                <span className="sidebar-price-amount">{hotel.pricePerNight || hotel.price} DT</span>
                <span className="sidebar-price-label">par nuit</span>
              </div>
              
              <div className="sidebar-rating">
                <span className="sidebar-rating-score">{hotel.rating || 4.5}</span>
                <div className="sidebar-rating-stars">
                  {'⭐'.repeat(Math.floor(hotel.rating || 4))}
                </div>
                <span className="sidebar-rating-count">{hotel.reviewsCount || 0} avis</span>
              </div>

              <div className="sidebar-actions">
                <button onClick={handleAddToCart} className="btn btn-secondary btn-full">
                  Ajouter au panier
                </button>
                <button onClick={handleBooking} className="btn btn-primary btn-full">
                  Réserver maintenant
                </button>
              </div>

              <div className="sidebar-features">
                <div className="feature">✓ Annulation gratuite</div>
                <div className="feature">✓ Confirmation immédiate</div>
                <div className="feature">✓ Meilleur prix garanti</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;