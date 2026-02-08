import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Reviews.css';
import reviewService from '../services/reviewService';
import ReviewCard from '../components/reviews/ReviewCard';
import AddReviewForm from '../components/reviews/AddReviewForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Reviews() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, highest, lowest
  const [filterRating, setFilterRating] = useState(0); // 0 = tous

  useEffect(() => {
    loadReviews();
  }, [type, id]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviews(type, id);
      setReviews(data);
    } catch (error) {
      console.error('Erreur:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowAddForm(false);
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    // Filtrer par note
    if (filterRating > 0) {
      filtered = filtered.filter(r => r.rating >= filterRating);
    }

    // Trier
    switch (sortBy) {
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      distribution[r.rating]++;
    });
    return distribution;
  };

  const getTypeLabel = () => {
    switch(type) {
      case 'flights': return 'ce vol';
      case 'hotels': return 'cet hôtel';
      case 'activities': return 'cette activité';
      default: return 'cet élément';
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Chargement des avis..." />;
  }

  const filteredReviews = getFilteredAndSortedReviews();
  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className="reviews-page">
      <div className="container">
        {/* En-tête */}
        <div className="reviews-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Retour
          </button>
          <h1 className="reviews-title">Avis clients</h1>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="btn btn-primary"
          >
            {showAddForm ? 'Annuler' : '✍️ Laisser un avis'}
          </button>
        </div>

        {/* Formulaire d'ajout d'avis */}
        {showAddForm && (
          <div className="add-review-section">
            <AddReviewForm 
              itemType={type}
              itemId={id}
              onReviewAdded={handleReviewAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div className="reviews-content">
          {/* Sidebar - Statistiques */}
          <aside className="reviews-sidebar">
            <div className="stats-card">
              <h3 className="stats-title">Note globale</h3>
              <div className="overall-rating">
                <div className="rating-number">{averageRating}</div>
                <div className="rating-stars">
                  {'⭐'.repeat(Math.floor(averageRating))}
                </div>
                <div className="rating-count">{reviews.length} avis</div>
              </div>

              <div className="rating-distribution">
                <h4>Répartition des notes</h4>
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="distribution-row">
                    <span className="distribution-label">
                      {rating} <span className="star-icon">⭐</span>
                    </span>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill" 
                        style={{
                          width: `${reviews.length > 0 ? (distribution[rating] / reviews.length) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="distribution-count">{distribution[rating]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-card">
              <h3 className="filters-title">Filtrer les avis</h3>
              
              <div className="filter-group">
                <label className="filter-label">Note minimale</label>
                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                  className="filter-select"
                >
                  <option value="0">Tous les avis</option>
                  <option value="5">5 étoiles</option>
                  <option value="4">4+ étoiles</option>
                  <option value="3">3+ étoiles</option>
                  <option value="2">2+ étoiles</option>
                  <option value="1">1+ étoile</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Trier par</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="recent">Plus récents</option>
                  <option value="highest">Note la plus élevée</option>
                  <option value="lowest">Note la plus basse</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Liste des avis */}
          <main className="reviews-main">
            <div className="reviews-list-header">
              <h2>
                {filteredReviews.length} avis {filterRating > 0 && `(${filterRating}+ étoiles)`}
              </h2>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <h3>Aucun avis trouvé</h3>
                <p>
                  {reviews.length === 0 
                    ? `Soyez le premier à laisser un avis sur ${getTypeLabel()}`
                    : 'Aucun avis ne correspond à vos critères de filtrage'}
                </p>
                {reviews.length === 0 && (
                  <button 
                    onClick={() => setShowAddForm(true)} 
                    className="btn btn-primary"
                  >
                    Laisser le premier avis
                  </button>
                )}
              </div>
            ) : (
              <div className="reviews-list">
                {filteredReviews.map(review => (
                  <ReviewCard 
                    key={review.id} 
                    review={review}
                    onDelete={handleReviewDeleted}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Reviews;