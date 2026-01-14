import React, { useState } from 'react';
import './BookingHistory.css';

function BookingHistory() {
  const [filter, setFilter] = useState('all');

  const bookings = [
    {
      id: 1,
      reference: 'TH2024001',
      type: 'Complet',
      destination: 'Paris, France',
      date: '2024-12-15',
      returnDate: '2024-12-22',
      status: 'confirmed',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      items: ['Vol Air France', 'Hôtel Le Marais 4*', 'Tour Eiffel']
    },
    {
      id: 2,
      reference: 'TH2024002',
      type: 'Vol',
      destination: 'Londres, UK',
      date: '2025-01-10',
      returnDate: '2025-01-15',
      status: 'pending',
      price: 450,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
      items: ['Vol British Airways']
    },
    {
      id: 3,
      reference: 'TH2023098',
      type: 'Hôtel',
      destination: 'Marrakech, Maroc',
      date: '2024-11-20',
      returnDate: '2024-11-27',
      status: 'completed',
      price: 680,
      image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400',
      items: ['Riad Luxe 5*', 'Spa & Hammam']
    },
    {
      id: 4,
      reference: 'TH2023085',
      type: 'Complet',
      destination: 'Rome, Italie',
      date: '2024-10-05',
      returnDate: '2024-10-12',
      status: 'completed',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
      items: ['Vol Alitalia', 'Hôtel Colosseo', 'Visite Vatican']
    },
    {
      id: 5,
      reference: 'TH2023070',
      type: 'Activité',
      destination: 'Dubai, EAU',
      date: '2024-09-15',
      returnDate: '2024-09-16',
      status: 'cancelled',
      price: 250,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
      items: ['Safari désert', 'Dîner bédouin']
    }
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

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
                {bookings.filter(b => b.status === 'confirmed').length}
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
                  <img src={booking.image} alt={booking.destination} />
                  <div className={getStatusClass(booking.status)}>
                    {getStatusText(booking.status)}
                  </div>
                </div>

                <div className="booking-content">
                  <div className="booking-header">
                    <div className="booking-main-info">
                      <h3 className="booking-destination">{booking.destination}</h3>
                      <p className="booking-reference">Réf: {booking.reference}</p>
                    </div>
                    <div className="booking-type-badge">
                      {booking.type}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        Du {new Date(booking.date).toLocaleDateString('fr-FR')} au{' '}
                        {new Date(booking.returnDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="booking-detail-item">
                      <span className="detail-icon">🎫</span>
                      <span className="detail-text">
                        {booking.items.join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <div className="booking-price">
                      <span className="price-label">Total payé</span>
                      <span className="price-value">{booking.price}DT</span>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-view">Voir détails</button>
                      {booking.status === 'confirmed' && (
                        <button className="btn-modify">Modifier</button>
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
                Vous n'avez pas encore de réservations dans cette catégorie
              </p>
              <a href="/" className="btn-browse">
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