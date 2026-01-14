import React from 'react';
import './DestinationCard.css';

function DestinationCard({ destination }) {
  const { name, country, image, description, price, rating, reviews } = destination;

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
          <button className="btn-explore">
            Explorer
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;