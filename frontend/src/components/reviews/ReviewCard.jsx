import React, { useState } from 'react';
import reviewService from '../../services/reviewService';
import authService from '../../services/authService';
import './ReviewCard.css';

function ReviewCard({ review, onDelete }) {
  const [isVoting, setIsVoting] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isMyReview = currentUser && review.userId === currentUser.id;

  const handleVote = async (helpful) => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      await reviewService.voteHelpful(review.id, helpful);
      window.location.reload();
    } catch (error) {
      console.error('Erreur vote:', error);
      alert('❌ Erreur lors du vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    try {
      await reviewService.deleteReview(review.id);
      alert('✅ Avis supprimé avec succès !');
      
      if (onDelete) {
        onDelete(review.id);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="rc-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={star <= rating ? 'rc-star-filled' : 'rc-star-empty'}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="rc-card">
      <div className="rc-header">
        <div className="rc-user-info">
          <div className="rc-avatar">
            <span className="rc-avatar-icon">👤</span>
          </div>
          <div className="rc-user-details">
            <div className="rc-user-name">
              {review.userName || 'Utilisateur'}
              {review.verified && (
                <span className="rc-verified-badge">✓ Vérifié</span>
              )}
            </div>
            <div className="rc-date">
              {new Date(review.date || review.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
        <div className="rc-rating">
          {renderStars(review.rating)}
          <span className="rc-rating-value">
            {review.rating}/5
          </span>
        </div>
      </div>

      <div className="rc-content">
        <p className="rc-comment">{review.comment}</p>
      </div>

      <div className="rc-footer">
        <div className="rc-helpful">
          <span className="rc-helpful-text">Utile ?</span>
          <div className="rc-helpful-buttons">
            <button
              onClick={() => handleVote(true)}
              className="rc-btn-helpful"
              disabled={isVoting}
            >
              👍 {review.helpful > 0 && review.helpful}
            </button>
            <button
              onClick={() => handleVote(false)}
              className="rc-btn-not-helpful"
              disabled={isVoting}
            >
              👎 {review.notHelpful > 0 && review.notHelpful}
            </button>
          </div>
        </div>

        {isMyReview && (
          <button onClick={handleDelete} className="rc-btn-delete">
            🗑️ Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;