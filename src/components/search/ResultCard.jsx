import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultCard.css';

function ResultCard({ result, searchType }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/${searchType}/${result.id}`);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      id: result.id,
      type: searchType,
      ...result,
      addedAt: new Date().toISOString()
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert('Ajouté au panier!');
  };

  const renderFlightCard = () => (
    <div className="result-card flight-card">
      <div className="card-header">
        <div className="airline-info">
          <img src={result.airlineLogo || 'https://via.placeholder.com/50'} alt={result.airline} className="airline-logo" />
          <div>
            <h3 className="airline-name">{result.airline}</h3>
            <p className="flight-number">{result.flightNumber}</p>
          </div>
        </div>
        <div className="price-tag">
          <span className="price">{result.price} DT</span>
          <span className="price-label">par personne</span>
        </div>
      </div>

      <div className="flight-details">
        <div className="flight-segment">
          <div className="time-info">
            <span className="time">{result.departureTime}</span>
            <span className="airport">{result.from}</span>
          </div>
          <div className="flight-duration">
            <div className="duration-line">
              <span className="duration-text">{result.duration}</span>
              <div className="line"></div>
            </div>
            <span className="stops-info">
              {result.stops === 0 ? 'Direct' : `${result.stops} escale${result.stops > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="time-info">
            <span className="time">{result.arrivalTime}</span>
            <span className="airport">{result.to}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="rating">
          <span className="stars">{'⭐'.repeat(Math.floor(result.rating || 4))}</span>
          <span className="rating-value">{result.rating || 4.0}</span>
          <span className="reviews-count">({result.reviewsCount || 0} avis)</span>
        </div>
        <div className="card-actions">
          <button onClick={handleViewDetails} className="btn btn-secondary">
            Détails
          </button>
          <button onClick={handleAddToCart} className="btn btn-primary">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  const renderHotelCard = () => (
    <div className="result-card hotel-card">
      <div className="card-image">
        <img src={result.image || 'https://via.placeholder.com/300x200'} alt={result.name} />
        {result.featured && <span className="badge-featured">Recommandé</span>}
      </div>

      <div className="card-content">
        <div className="hotel-header">
          <div>
            <h3 className="hotel-name">{result.name}</h3>
            <p className="hotel-location">📍 {result.location}</p>
            <div className="hotel-rating">
              <span className="stars">{'⭐'.repeat(result.stars || 3)}</span>
              <span className="rating-value">{result.rating || 4.0}/5</span>
              <span className="reviews-count">({result.reviewsCount || 0} avis)</span>
            </div>
          </div>
          <div className="price-section">
            <span className="price">{result.pricePerNight || result.price} DT</span>
            <span className="price-label">par nuit</span>
          </div>
        </div>

        <div className="amenities">
          {result.amenities && result.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>

        <div className="card-footer">
          <button onClick={handleViewDetails} className="btn btn-secondary">
            Voir les détails
          </button>
          <button onClick={handleAddToCart} className="btn btn-primary">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivityCard = () => (
    <div className="result-card activity-card">
      <div className="card-image">
        <img src={result.image || 'https://via.placeholder.com/300x200'} alt={result.title} />
        <span className="category-badge">{result.category || 'Activité'}</span>
      </div>

      <div className="card-content">
        <h3 className="activity-title">{result.title}</h3>
        <p className="activity-description">{result.description}</p>

        <div className="activity-info">
          <div className="info-item">
            <span className="icon">⏱️</span>
            <span>{result.duration || '2h'}</span>
          </div>
          <div className="info-item">
            <span className="icon">👥</span>
            <span>{result.groupSize || '2-10 pers'}</span>
          </div>
          <div className="info-item">
            <span className="icon">🗣️</span>
            <span>{result.language || 'Français'}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="rating">
            <span className="stars">⭐</span>
            <span className="rating-value">{result.rating || 4.5}</span>
            <span className="reviews-count">({result.reviewsCount || 0})</span>
          </div>
          <div className="price-section">
            <span className="price">{result.price} DT</span>
          </div>
        </div>

        <div className="card-actions">
          <button onClick={handleViewDetails} className="btn btn-secondary btn-full">
            En savoir plus
          </button>
          <button onClick={handleAddToCart} className="btn btn-primary btn-full">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );

  if (searchType === 'flights') return renderFlightCard();
  if (searchType === 'hotels') return renderHotelCard();
  if (searchType === 'activities') return renderActivityCard();

  return null;
}

export default ResultCard;