import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={loadStats} className="btn-retry">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Tableau de Bord Admin</h1>
          <p className="admin-subtitle">Vue d'ensemble de la plateforme TravelHub</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Utilisateurs */}
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalUsers || 0}</h3>
              <p className="stat-label">Utilisateurs Total</p>
              <span className="stat-badge">
                +{stats?.newUsersThisMonth || 0} ce mois
              </span>
            </div>
          </div>

          {/* Réservations */}
          <div className="stat-card bookings">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalBookings || 0}</h3>
              <p className="stat-label">Réservations Total</p>
              <div className="stat-details">
                <span>✅ {stats?.confirmedBookings || 0} confirmées</span>
                <span>⏳ {stats?.pendingBookings || 0} en attente</span>
              </div>
            </div>
          </div>

          {/* Revenus */}
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-value">
                {stats?.totalRevenue?.toFixed(2) || '0.00'} DT
              </h3>
              <p className="stat-label">Revenus Total</p>
              <span className="stat-badge success">En hausse</span>
            </div>
          </div>

          {/* Avis */}
          <div className="stat-card reviews">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalReviews || 0}</h3>
              <p className="stat-label">Avis Total</p>
              <div className="stat-details">
                <span>✅ {stats?.approvedReviews || 0} approuvés</span>
                <span>⏳ {stats?.pendingReviews || 0} en attente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Actions Rapides</h2>
          <div className="actions-grid">
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Gérer Utilisateurs</h3>
              <p>Voir et modifier les utilisateurs</p>
            </Link>

            <Link to="/admin/bookings" className="action-card">
              <div className="action-icon">📅</div>
              <h3>Gérer Réservations</h3>
              <p>Suivre les réservations</p>
            </Link>

            <Link to="/admin/reviews" className="action-card">
              <div className="action-icon">⭐</div>
              <h3>Modérer Avis</h3>
              <p>Approuver ou rejeter les avis</p>
            </Link>
            <Link to="/admin/contacts" className="action-card">
              <div className="action-icon">✉️</div>
              <h3>Messages Contact</h3>
              <p>Gérer les messages reçus</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">Activité Récente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon new-user">👤</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>Nouvel utilisateur</strong> s'est inscrit
                </p>
                <span className="activity-time">Il y a 5 minutes</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon new-booking">📅</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>Nouvelle réservation</strong> pour Paris
                </p>
                <span className="activity-time">Il y a 15 minutes</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon new-review">⭐</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>Nouvel avis</strong> en attente de modération
                </p>
                <span className="activity-time">Il y a 30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
