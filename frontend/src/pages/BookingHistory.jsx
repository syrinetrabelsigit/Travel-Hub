import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import './BookingHistory.css';

function BookingHistory() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger vos réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings(); // Recharger la liste
      alert('Réservation annulée avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'annulation de la réservation');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'confirmed':
        return 'Confirmée';
      case 'PENDING':
      case 'pending':
        return 'En attente';
      case 'COMPLETED':
      case 'completed':
        return 'Terminée';
      case 'CANCELLED':
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="booking-history-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement de vos réservations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-history-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Erreur</h2>
            <p>{error}</p>
            <button onClick={loadBookings} className="btn-retry">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-history-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Mes Réservations</h1>
            <p className="page-subtitle">
              Consultez l'historique de toutes vos réservations
            </p>
          </div>
          <div className="page-header-stats">
            <div className="stat-mini">
              <span className="stat-mini-number">{bookings.length}</span>
              <span className="stat-mini-label">Total</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-number">
                {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
              </span>
              <span className="stat-mini-label">Confirmées</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="booking-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="filter-icon">📋</span>
            Toutes
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            <span className="filter-icon">✓</span>
            Confirmées
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <span className="filter-icon">⏳</span>
            En attente
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <span className="filter-icon">✅</span>
            Terminées
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            <span className="filter-icon">❌</span>
            Annulées
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-image">
                  <img 
                    src={booking.image || 'https://via.placeholder.com/400x250'} 
                    alt={booking.type || 'Réservation'} 
                  />
                  <div className={getStatusClass(booking.status)}>
                    {getStatusText(booking.status)}
                  </div>
                </div>

                <div className="booking-content">
                  <div className="booking-header">
                    <div className="booking-main-info">
                      <h3 className="booking-destination">
                        {booking.destination || booking.type || 'Réservation'}
                      </h3>
                      <p className="booking-reference">Réf: {booking.id}</p>
                    </div>
                    <div className="booking-type-badge">
                      {booking.type || 'Voyage'}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {booking.date ? new Date(booking.createdAt).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
                      </span>
                    </div>
                    {booking.items && booking.items.length > 0 && (
                      <div className="booking-detail-item">
                        <span className="detail-icon">🎫</span>
                        <span className="detail-text">
                          {booking.items.map(item => item.name || item).join(' • ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="booking-footer">
                    <div className="booking-price">
                      <span className="price-label">Total payé</span>
                      <span className="price-value">{booking.totalPrice || booking.price || 0} DT</span>
                    </div>
                    <div className="booking-actions">
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/booking/${booking.id}`)}
                      >
                        Voir détails
                      </button>
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <button 
                          className="btn-modify"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3 className="empty-title">Aucune réservation trouvée</h3>
              <p className="empty-text">
                {bookings.length === 0 
                  ? "Vous n'avez pas encore de réservations"
                  : 'Aucune réservation ne correspond à vos critères de filtrage'}
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="btn-browse"
              >
                Découvrir nos destinations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;