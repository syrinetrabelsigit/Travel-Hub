import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import './BookingHistory.css';
import { Link } from 'react-router-dom';

function BookingHistory() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les réservations au démarrage
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      setError('Erreur lors du chargement des réservations');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await bookingService.cancelBooking(id);
        alert('Réservation annulée avec succès !');
        await fetchBookings(); // Refresh la liste
      } catch (error) {
        console.error('Erreur annulation:', error);
        alert('Erreur lors de l\'annulation de la réservation');
      }
    }
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      // Appel API pour télécharger la facture PDF
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('travelhub_auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur téléchargement facture');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status || 'Inconnu';
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status?.toLowerCase() || 'unknown'}`;
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status?.toLowerCase() === filter);

  if (isLoading) {
    return (
      <div className="bh-page">
        <div className="bh-container">
          <div className="bh-loading">
            <div className="bh-spinner"></div>
            <p>Chargement de vos réservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bh-page">
      <div className="bh-container">
        {/* Header */}
        <div className="bh-page-header">
          <div className="bh-header-content">
            <h1 className="bh-page-title">Mes Réservations</h1>
            <p className="bh-page-subtitle">
              Consultez l'historique de toutes vos réservations
            </p>
          </div>
          <div className="bh-header-stats">
            <div className="bh-stat-mini">
              <span className="bh-stat-number">{bookings.length}</span>
              <span className="bh-stat-label">Total</span>
            </div>
            <div className="bh-stat-mini">
              <span className="bh-stat-number">
                {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
              </span>
              <span className="bh-stat-label">Confirmées</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bh-alert bh-alert-error">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bh-filters">
          <button
            className={`bh-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="bh-filter-icon">📋</span>
            Toutes
          </button>
          <button
            className={`bh-filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            <span className="bh-filter-icon">✓</span>
            Confirmées
          </button>
          <button
            className={`bh-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <span className="bh-filter-icon">⏳</span>
            En attente
          </button>
          <button
            className={`bh-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <span className="bh-filter-icon">✅</span>
            Terminées
          </button>
          <button
            className={`bh-filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            <span className="bh-filter-icon">❌</span>
            Annulées
          </button>
        </div>

        {/* Bookings List */}
        <div className="bh-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bh-card">
                <div className="bh-card-image">
                  <div className="bh-image-placeholder">
                    <span className="bh-placeholder-icon">📋</span>
                  </div>
                  <div className={`bh-status-badge bh-status-${booking.status?.toLowerCase() || 'unknown'}`}>
                    {getStatusText(booking.status)}
                  </div>
                </div>

                <div className="bh-card-content">
                  <div className="bh-card-header">
                    <div className="bh-main-info">
                      <h3 className="bh-destination">
                        Réservation #{booking.id}
                      </h3>
                      <p className="bh-reference">
                        Réf: {booking.bookingReference || booking.id}
                      </p>
                    </div>
                    <div className="bh-type-badge">
                      {booking.items?.length || 0} article{booking.items?.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="bh-details">
                    <div className="bh-detail-item">
                      <span className="bh-detail-icon">📅</span>
                      <span className="bh-detail-text">
                        Créée le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="bh-detail-item">
                      <span className="bh-detail-icon">💳</span>
                      <span className="bh-detail-text">
                        {booking.paymentStatus || 'En attente'}
                      </span>
                    </div>
                    {booking.items && booking.items.length > 0 && (
                      <div className="bh-detail-item">
                        <span className="bh-detail-icon">🎫</span>
                        <span className="bh-detail-text">
                          {booking.items.length} élément{booking.items.length > 1 ? 's' : ''} réservé{booking.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bh-footer">
                    <div className="bh-price">
                      <span className="bh-price-label">Total payé</span>
                      <span className="bh-price-value">
                        {booking.totalPrice?.toFixed(2) || '0.00'} {booking.currency || 'EUR'}
                      </span>
                    </div>
                    <div className="bh-actions">
                      <button
                        className="bh-btn-view"
                        onClick={() => handleDownloadInvoice(booking.id)}
                      >
                        📄 Facture PDF
                      </button>
                      
                      {(booking.status?.toLowerCase() === 'confirmed' || 
                        booking.status?.toLowerCase() === 'completed') && (
                        <Link
                          to={`/reviews/${booking.items?.[0]?.type || 'flight'}/${booking.items?.[0]?.itemId || booking.id}`}
                          className="bh-btn-review"
                        >
                          ⭐ Laisser un avis
                        </Link>
                      )}
                      
                      {booking.status?.toLowerCase() === 'confirmed' && (
                        <button
                          className="bh-btn-cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          ❌ Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bh-empty">
              <div className="bh-empty-icon">📭</div>
              <h3 className="bh-empty-title">Aucune réservation trouvée</h3>
              <p className="bh-empty-text">
                {filter === 'all'
                  ? "Vous n'avez pas encore de réservations"
                  : `Vous n'avez pas de réservations ${getStatusText(filter).toLowerCase()}`
                }
              </p>
              <a href="/" className="bh-btn-browse">
                Découvrir nos destinations
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;