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
      <div className="ar-container">
        {/* Header */}
        <div className="ar-page-header">
          <div className="ar-header-content">
            <Link to="/admin" className="ar-back-link">← Retour au Dashboard</Link>
            <h1 className="ar-page-title">Modération des Avis</h1>
            <p className="ar-page-subtitle">{reviews.length} avis au total</p>
          </div>
          <div className="ar-header-stats">
            <span>{reviews.length}</span>
            <label>Avis</label>
          </div>
        </div>

        {/* Filters */}
        <div className="ar-filters-bar">
          <div className="ar-filter-group">
            <label>Statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ar-filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="ar-reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="ar-no-results">
              <p>Aucun avis trouvé</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className={`ar-review-card ${review.status?.toLowerCase()}`}>
                <div className="ar-review-header">
                  <div className="ar-reviewer-info">
                    <div className="ar-reviewer-avatar">
                      {review.userName?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="ar-reviewer-name">{review.userName || 'Utilisateur'}</h3>
                      <div className="ar-review-rating">
                        {renderStars(review.rating || 0)}
                      </div>
                    </div>
                  </div>
                  <div className={`ar-review-status ${review.status?.toLowerCase()}`}>
                    {review.status === 'PENDING' && '⏳ En attente'}
                    {review.status === 'APPROVED' && '✅ Approuvé'}
                    {review.status === 'REJECTED' && '❌ Rejeté'}
                  </div>
                </div>

                <div className="ar-review-content">
                  <p className="ar-review-comment">{review.comment}</p>
                </div>

                <div className="ar-review-meta">
                  <span className="ar-review-item">
                    📍 {review.itemType}: {review.itemId}
                  </span>
                  <span className="ar-review-date">
                    📅 {review.createdAt 
                      ? new Date(review.createdAt).toLocaleDateString('fr-FR')
                      : 'N/A'
                    }
                  </span>
                </div>

                {review.status === 'PENDING' && (
                  <div className="ar-review-actions">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="ar-btn-approve"
                    >
                      ✅ Approuver
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="ar-btn-reject"
                    >
                      ❌ Rejeter
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(review.id)}
                  className="ar-btn-delete-review"
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
