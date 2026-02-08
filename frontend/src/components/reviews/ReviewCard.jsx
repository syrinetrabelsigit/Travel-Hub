import React, { useState } from 'react';
import './ReviewCard.css';
import authService from '../../services/authService';
import reviewService from '../../services/reviewService';

function ReviewCard({ review, onDelete }) {
  const [helpful, setHelpful] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isOwner = currentUser && currentUser.email === review.authorEmail;

  const handleHelpful = () => {
    setHelpful(helpful + 1);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await reviewService.deleteReview(review.id);
      onDelete(review.id);
    } catch (error) {
      alert('Erreur lors de la suppression de l\'avis');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="author-info">
          <div className="author-avatar">
            {review.author?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="author-details">
            <h4 className="author-name">{review.author || 'Anonyme'}</h4>
            <span className="review-date">{formatDate(review.date || new Date())}</span>
          </div>
        </div>
        <div className="rating">
          <div className="rating-stars">
            {'⭐'.repeat(review.rating)}
          </div>
          <span className="rating-value">{review.rating}/5</span>
        </div>
      </div>

      <div className="review-content">
        <p className="review-comment">{review.comment}</p>
        
        {review.images && review.images.length > 0 && (
          <div className="review-images">
            {review.images.map((img, index) => (
              <img key={index} src={img} alt={`Photo ${index + 1}`} className="review-image" />
            ))}
          </div>
        )}
      </div>

      <div className="review-footer">
        <button className="helpful-button" onClick={handleHelpful}>
          <span className="helpful-icon">👍</span>
          Utile ({helpful})
        </button>

        {isOwner && (
          <button 
            className="delete-button" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <span className="delete-icon">🗑️</span>
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;