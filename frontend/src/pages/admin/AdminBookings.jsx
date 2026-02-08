import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './AdminBookings.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      alert('Statut mis à jour avec succès');
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
      console.error(err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      await adminService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Réservation supprimée avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  // Filtrage des réservations
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
    const matchesSearch = 
      booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      <div className="admin-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <Link to="/admin" className="back-link">← Retour au Dashboard</Link>
            <h1 className="page-title">Gestion des Réservations</h1>
            <p className="page-subtitle">{bookings.length} réservations au total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="CANCELLED">Annulé</option>
              <option value="COMPLETED">Terminé</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bookings-grid">
          {filteredBookings.length === 0 ? (
            <div className="no-results">
              <p>Aucune réservation trouvée</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3 className="booking-title">{booking.type || 'Vol'}</h3>
                    <p className="booking-id">ID: {booking.id}</p>
                  </div>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className={`status-badge ${booking.status?.toLowerCase()}`}
                  >
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="CANCELLED">Annulé</option>
                    <option value="COMPLETED">Terminé</option>
                  </select>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-icon">👤</span>
                    <span>User ID: {booking.userId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>
                      {booking.createdAt 
                        ? new Date(booking.createdAt).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>{booking.totalPrice?.toFixed(2) || '0.00'} DT</span>
                  </div>
                </div>

                {booking.items && booking.items.length > 0 && (
                  <div className="booking-items">
                    <h4>Articles:</h4>
                    {booking.items.map((item, index) => (
                      <div key={index} className="item-chip">
                        {item.type}: {item.name}
                      </div>
                    ))}
                  </div>
                )}

                <div className="booking-actions">
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="btn-delete"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
