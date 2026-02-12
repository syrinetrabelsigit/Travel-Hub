import React from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';
import './ResultCard.css';

function ResultCard({ result, searchType }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/${searchType}/${result.id}`);
  };

  const handleAddToCart = async () => {
    try {
      let itemPrice = 0;
      
      if (searchType === 'flights') {
        itemPrice = result.price;
      } else if (searchType === 'hotels') {
        itemPrice = result.pricePerNight || result.price;
      } else if (searchType === 'activities') {
        itemPrice = result.price;
      }

      const finalPrice = parseFloat(itemPrice);
      
      if (!finalPrice || finalPrice <= 0) {
        alert('Prix invalide pour cet article');
        return;
      }

      const cartItem = {
        type: searchType.slice(0, -1),
        itemId: result.id,
        data: result,
        price: finalPrice,
        quantity: 1
      };
      
      await cartService.addItem(cartItem);
      alert('Ajouté au panier avec succès ! 🎉');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const renderFlightCard = () => (
    <div className="rc-card rc-flight-card">
      <div className="rc-header">
        <div className="rc-airline-info">
          <img src={result.airlineLogo} alt={result.airline} className="rc-airline-logo" />
          <div>
            <h3 className="rc-airline-name">{result.airline}</h3>
            <p className="rc-flight-number">{result.flightNumber}</p>
          </div>
        </div>
        <div className="rc-price-tag">
          <span className="rc-price">{result.price} DT</span>
          <span className="rc-price-label">par personne</span>
        </div>
      </div>

      <div className="rc-flight-details">
        <div className="rc-flight-segment">
          <div className="rc-time-info">
            <span className="rc-time">{result.departureTime}</span>
            <span className="rc-airport">{result.from}</span>
          </div>
          <div className="rc-flight-duration">
            <div className="rc-duration-line">
              <span className="rc-duration-text">{result.duration}</span>
              <div className="rc-line"></div>
            </div>
            <span className="rc-stops-info">
              {result.stops === 0 ? 'Direct' : `${result.stops} escale${result.stops > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="rc-time-info">
            <span className="rc-time">{result.arrivalTime}</span>
            <span className="rc-airport">{result.to}</span>
          </div>
        </div>
      </div>

      <div className="rc-footer">
        <div className="rc-rating">
          <span className="rc-stars">{'⭐'.repeat(Math.floor(result.rating || 4))}</span>
          <span className="rc-rating-value">{result.rating || 4.0}</span>
          <span className="rc-reviews-count">({result.reviewsCount || 0} avis)</span>
        </div>
        <div className="rc-actions">
          <button onClick={handleViewDetails} className="rc-btn rc-btn-secondary">
            Détails
          </button>
          <button onClick={handleAddToCart} className="rc-btn rc-btn-primary">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  const renderHotelCard = () => (
    <div className="rc-card rc-hotel-card">
      <div className="rc-image">
        <img src={result.imageUrl} alt={result.name} />
        {result.featured && <span className="rc-badge-featured">Recommandé</span>}
      </div>

      <div className="rc-content">
        <div className="rc-hotel-header">
          <div>
            <h3 className="rc-hotel-name">{result.name}</h3>
            <p className="rc-hotel-location">📍 {result.location}</p>
            <div className="rc-hotel-rating">
              <span className="rc-stars">{'⭐'.repeat(result.stars || 3)}</span>
              <span className="rc-rating-value">{result.rating || 4.0}/5</span>
              <span className="rc-reviews-count">({result.reviewsCount || 0} avis)</span>
            </div>
          </div>
          <div className="rc-price-section">
            <span className="rc-price">{result.pricePerNight || result.price} DT</span>
            <span className="rc-price-label">par nuit</span>
          </div>
        </div>

        <div className="rc-amenities">
          {result.amenities && result.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="rc-amenity-tag">{amenity}</span>
          ))}
        </div>

        <div className="rc-footer">
          <button onClick={handleViewDetails} className="rc-btn rc-btn-secondary">
            Voir les détails
          </button>
          <button onClick={handleAddToCart} className="rc-btn rc-btn-primary">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivityCard = () => (
    <div className="rc-card rc-activity-card">
      <div className="rc-image">
        <img src={result.image || 'https://via.placeholder.com/300x200'} alt={result.title} />
        <span className="rc-category-badge">{result.category || 'Activité'}</span>
      </div>

      <div className="rc-content">
        <h3 className="rc-activity-title">{result.title}</h3>
        <p className="rc-activity-description">{result.description}</p>

        <div className="rc-activity-info">
          <div className="rc-info-item">
            <span className="rc-icon">⏱️</span>
            <span>{result.duration || '2h'}</span>
          </div>
          <div className="rc-info-item">
            <span className="rc-icon">👥</span>
            <span>{result.groupSize || '2-10 pers'}</span>
          </div>
          <div className="rc-info-item">
            <span className="rc-icon">🗣️</span>
            <span>{result.language || 'Français'}</span>
          </div>
        </div>

        <div className="rc-footer">
          <div className="rc-rating">
            <span className="rc-stars">⭐</span>
            <span className="rc-rating-value">{result.rating || 4.5}</span>
            <span className="rc-reviews-count">({result.reviewsCount || 0})</span>
          </div>
          <div className="rc-price-section">
            <span className="rc-price">{result.price} DT</span>
          </div>
        </div>

        <div className="rc-actions">
          <button onClick={handleViewDetails} className="rc-btn rc-btn-secondary rc-btn-full">
            En savoir plus
          </button>
          <button onClick={handleAddToCart} className="rc-btn rc-btn-primary rc-btn-full">
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