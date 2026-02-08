import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './AdminReviews.css';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllReviews();
      setReviews(data);
    } catch (err) {
      setError('Erreur lors du chargement des avis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await adminService.approveReview(reviewId);
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status: 'APPROVED' } : review
      ));
      alert('Avis approuvé avec succès');
    } catch (err) {
      alert('Erreur lors de l\'approbation');
      console.error(err);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await adminService.rejectReview(reviewId);
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status: 'REJECTED' } : review
      ));
      alert('Avis rejeté avec succès');
    } catch (err) {
      alert('Erreur lors du rejet');
      console.error(err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    try {
      await adminService.deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('Avis supprimé avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Filtrage des avis
  const filteredReviews = reviews.filter(review => {
    return filterStatus === 'ALL' || review.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <div className="admin-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <Link to="/admin" className="back-link">← Retour au Dashboard</Link>
            <h1 className="page-title">Modération des Avis</h1>
            <p className="page-subtitle">{reviews.length} avis au total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="no-results">
              <p>Aucun avis trouvé</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className={`review-card ${review.status?.toLowerCase()}`}>
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.userName?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="reviewer-name">{review.userName || 'Utilisateur'}</h3>
                      <div className="review-rating">
                        {renderStars(review.rating || 0)}
                      </div>
                    </div>
                  </div>
                  <div className={`review-status ${review.status?.toLowerCase()}`}>
                    {review.status === 'PENDING' && '⏳ En attente'}
                    {review.status === 'APPROVED' && '✅ Approuvé'}
                    {review.status === 'REJECTED' && '❌ Rejeté'}
                  </div>
                </div>

                <div className="review-content">
                  <p className="review-comment">{review.comment}</p>
                </div>

                <div className="review-meta">
                  <span className="review-item">
                    📍 {review.itemType}: {review.itemId}
                  </span>
                  <span className="review-date">
                    📅 {review.createdAt 
                      ? new Date(review.createdAt).toLocaleDateString('fr-FR')
                      : 'N/A'
                    }
                  </span>
                </div>

                {review.status === 'PENDING' && (
                  <div className="review-actions">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="btn-approve"
                    >
                      ✅ Approuver
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="btn-reject"
                    >
                      ❌ Rejeter
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(review.id)}
                  className="btn-delete-review"
                >
                  🗑️ Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
