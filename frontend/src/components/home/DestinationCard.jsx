import React from 'react';
import { useNavigate } from 'react-router-dom'; // AJOUT
import './DestinationCard.css';

function DestinationCard({ destination }) {
  const navigate = useNavigate(); // AJOUT
  const { name, country, image, description, price, rating, reviews } = destination;

  // AJOUT : Fonction pour rediriger vers la recherche
  const handleExplore = () => {
    navigate('/search', { 
      state: { 
        searchType: 'hotels', // Par défaut chercher des hôtels pour cette destination
        searchData: {
          destination: name
        }
      } 
    });
  };

  return (
    <div className="destination-card">
      <div className="destination-image">
        <img src={image} alt={`${name}, ${country}`} />
        <div className="destination-overlay">
          <button className="btn-favorite">
            <span className="heart-icon">❤️</span>
          </button>
        </div>
      </div>

      <div className="destination-content">
        <div className="destination-header">
          <div className="destination-info">
            <h3 className="destination-name">{name}</h3>
            <p className="destination-country">{country}</p>
          </div>
          <div className="destination-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{rating}</span>
            <span className="rating-reviews">({reviews})</span>
          </div>
        </div>

        <p className="destination-description">{description}</p>

        <div className="destination-footer">
          <div className="destination-price">
            <span className="price-label">À partir de</span>
            <span className="price-value">{price}DT</span>
          </div>
          {/* MODIFIÉ : Ajout de onClick */}
          <button className="btn-explore" onClick={handleExplore}>
            Explorer
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;