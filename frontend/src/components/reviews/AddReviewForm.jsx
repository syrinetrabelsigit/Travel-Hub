import React, { useState } from 'react';
import reviewService from '../../services/reviewService';
import './AddReviewForm.css';

function AddReviewForm({ itemType, itemId, onReviewAdded, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Veuillez ajouter un commentaire');
      return;
    }

    if (comment.length < 10) {
      setError('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newReview = await reviewService.createReview({
        itemType: itemType,
        itemId: itemId,
        rating: rating,
        comment: comment.trim()
      });

      alert('✅ Avis publié avec succès !');
      
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }

      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Erreur création avis:', error);
      setError(error.message || 'Erreur lors de la publication de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="arf-container">
      <h3 className="arf-title">Laisser un avis</h3>
      
      <form onSubmit={handleSubmit} className="arf-form">
        {error && (
          <div className="arf-alert arf-alert-error">
            {error}
          </div>
        )}

        <div className="arf-group">
          <label className="arf-label">
            Note *
          </label>
          <div className="arf-rating-container">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`arf-star-btn ${star <= rating ? 'active' : ''}`}
              >
                ⭐
              </button>
            ))}
            <span className="arf-rating-text">{rating}/5</span>
          </div>
        </div>

        <div className="arf-group">
          <label className="arf-label">
            Commentaire *
            <span className="arf-char-count">({comment.length}/1000)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            className="arf-textarea"
            rows="5"
            maxLength="1000"
            required
          />
          <small className="arf-hint">Minimum 10 caractères</small>
        </div>

        <div className="arf-actions">
          <button
            type="button"
            onClick={onCancel}
            className="arf-btn arf-btn-secondary"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="arf-btn arf-btn-primary"
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? 'Publication...' : 'Publier l\'avis'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReviewForm;