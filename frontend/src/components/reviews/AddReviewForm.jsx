import React, { useState } from 'react';
import './AddReviewForm.css';
import reviewService from '../../services/reviewService';
import authService from '../../services/authService';

function AddReviewForm({ itemType, itemId, onReviewAdded, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (!comment.trim()) {
      setError('Veuillez écrire un commentaire');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = authService.getCurrentUser();
      const reviewData = {
        itemType,
        itemId,
        rating,
        comment: comment.trim(),
        author: user ? `${user.firstName} ${user.lastName}` : 'Anonyme',
        authorEmail: user?.email || '',
        date: new Date().toISOString()
      };

      const newReview = await reviewService.createReview(reviewData);
      onReviewAdded(newReview);
      
      // Réinitialiser le formulaire
      setRating(0);
      setComment('');
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-review-form">
      <div className="form-header">
        <h3 className="form-title">Partagez votre expérience</h3>
        <p className="form-subtitle">Votre avis aidera d'autres voyageurs</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Sélection de la note */}
        <div className="rating-section">
          <label className="section-label">Votre note</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <span className="star-icon">
                  {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="rating-label">
              {rating === 5 ? 'Excellent' : 
               rating === 4 ? 'Très bien' : 
               rating === 3 ? 'Bien' : 
               rating === 2 ? 'Moyen' : 
               'Décevant'}
            </div>
          )}
        </div>

        {/* Commentaire */}
        <div className="comment-section">
          <label htmlFor="comment" className="section-label">
            Votre avis
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-textarea"
            placeholder="Décrivez votre expérience... Qu'avez-vous aimé ? Qu'est-ce qui pourrait être amélioré ?"
            rows="6"
            maxLength="1000"
          />
          <div className="character-count">
            {comment.length} / 1000 caractères
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReviewForm;