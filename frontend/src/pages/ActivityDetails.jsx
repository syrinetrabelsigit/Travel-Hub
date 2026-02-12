import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivityDetails.css';
import searchService from '../services/searchService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    loadActivityDetails();
  }, [id]);

  const loadActivityDetails = async () => {
    try {
      const data = await searchService.getActivityDetails(id);
      setActivity(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }
    navigate(`/booking/activities/${id}`, {
      state: { date: selectedDate, participants }
    });
  };

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: activity.id,
      type: 'activity',
      ...activity,
      selectedDate,
      participants,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Activité ajoutée au panier !');
  };

  if (isLoading) return <LoadingSpinner text="Chargement des détails de l'activité..." />;
  
  if (!activity) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Activité non trouvée</h2>
        <p>L'activité que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <button onClick={() => navigate('/search')} className="btn btn-primary">
          Retour à la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="activity-details-page">
      <div className="container">
        {/* En-tête */}
        <div className="details-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Retour
          </button>
          <div className="header-content">
            <div className="header-left">
              <span className="category-badge">{activity.category || 'Activité'}</span>
              <h1 className="activity-title">{activity.title}</h1>
              <div className="activity-meta">
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <span>{activity.location || 'Non spécifié'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>{activity.duration || '2-3 heures'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <span>{activity.rating || 4.5} ({activity.reviewsCount || 0} avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image principale */}
        <img 
  src={activity.image || 'https://via.placeholder.com/1200x600'} 
  alt={activity.title} 
  className="activity-main-image"
/>

        <div className="activity-content">
          <div className="content-main">
            {/* Description */}
            <section className="details-card">
              <div className="card-icon">📝</div>
              <h2 className="card-title">Description</h2>
              <p className="activity-description">
                {activity.description || 
                  "Découvrez une expérience unique et inoubliable. Cette activité vous permettra de vivre des moments exceptionnels et de créer des souvenirs mémorables. Profitez d'une organisation professionnelle et d'un encadrement de qualité pour une expérience en toute sécurité."}
              </p>
            </section>

            {/* Points forts */}
            <section className="details-card">
              <div className="card-icon">✨</div>
              <h2 className="card-title">Points forts</h2>
              <div className="highlights-list">
                {(activity.highlights || [
                  'Expérience unique et authentique',
                  'Guide professionnel et passionné',
                  'Petit groupe pour plus de convivialité',
                  'Équipement fourni',
                  'Adapté à tous les niveaux'
                ]).map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <span className="highlight-icon">✓</span>
                    <span className="highlight-text">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Programme */}
            <section className="details-card">
              <div className="card-icon">📅</div>
              <h2 className="card-title">Programme détaillé</h2>
              <div className="program-timeline">
                <div className="program-step">
                  <div className="step-marker">1</div>
                  <div className="step-content">
                    <h4>Accueil et briefing</h4>
                    <p>Présentation de l'activité et consignes de sécurité</p>
                    <span className="step-duration">15 minutes</span>
                  </div>
                </div>
                <div className="program-step">
                  <div className="step-marker">2</div>
                  <div className="step-content">
                    <h4>Début de l'activité</h4>
                    <p>Découverte et immersion dans l'expérience</p>
                    <span className="step-duration">1h30</span>
                  </div>
                </div>
                <div className="program-step">
                  <div className="step-marker">3</div>
                  <div className="step-content">
                    <h4>Pause et rafraîchissements</h4>
                    <p>Moment de détente et d'échange</p>
                    <span className="step-duration">30 minutes</span>
                  </div>
                </div>
                <div className="program-step">
                  <div className="step-marker">4</div>
                  <div className="step-content">
                    <h4>Fin de l'activité</h4>
                    <p>Clôture et retour au point de départ</p>
                    <span className="step-duration">15 minutes</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Inclus / Non inclus */}
            <section className="details-card">
              <div className="card-icon">📦</div>
              <h2 className="card-title">Ce qui est inclus / non inclus</h2>
              <div className="inclusion-grid">
                <div className="inclusion-section">
                  <h4 className="inclusion-title included">✓ Inclus</h4>
                  <ul className="inclusion-list">
                    <li>Guide professionnel</li>
                    <li>Tout l'équipement nécessaire</li>
                    <li>Assurance</li>
                    <li>Photos souvenirs</li>
                    <li>Boissons et snacks</li>
                  </ul>
                </div>
                <div className="inclusion-section">
                  <h4 className="inclusion-title not-included">✗ Non inclus</h4>
                  <ul className="inclusion-list">
                    <li>Transport jusqu'au point de rendez-vous</li>
                    <li>Repas complet</li>
                    <li>Pourboires (optionnels)</li>
                    <li>Dépenses personnelles</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Informations pratiques */}
            <section className="details-card">
              <div className="card-icon">ℹ️</div>
              <h2 className="card-title">Informations pratiques</h2>
              <div className="info-grid">
                <div className="info-box">
                  <div className="info-box-icon">👥</div>
                  <div className="info-box-content">
                    <h4>Taille du groupe</h4>
                    <p>{activity.groupSize || '2-10 personnes'}</p>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-box-icon">🗣️</div>
                  <div className="info-box-content">
                    <h4>Langues</h4>
                    <p>{activity.language || 'Français, Anglais'}</p>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-box-icon">♿</div>
                  <div className="info-box-content">
                    <h4>Accessibilité</h4>
                    <p>{activity.accessibility || 'Non accessible en fauteuil roulant'}</p>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-box-icon">👕</div>
                  <div className="info-box-content">
                    <h4>Tenue recommandée</h4>
                    <p>Vêtements confortables et chaussures adaptées</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Politique d'annulation */}
            <section className="details-card">
              <div className="card-icon">🔄</div>
              <h2 className="card-title">Politique d'annulation</h2>
              <div className="cancellation-policy">
                <div className="policy-item success">
                  <span className="policy-icon">✓</span>
                  <div className="policy-text">
                    <strong>Annulation gratuite</strong>
                    <p>Jusqu'à 24 heures avant le début de l'activité</p>
                  </div>
                </div>
                <div className="policy-item warning">
                  <span className="policy-icon">⚠️</span>
                  <div className="policy-text">
                    <strong>Annulation avec frais</strong>
                    <p>50% de remboursement entre 24h et 12h avant</p>
                  </div>
                </div>
                <div className="policy-item danger">
                  <span className="policy-icon">✗</span>
                  <div className="policy-text">
                    <strong>Pas de remboursement</strong>
                    <p>Moins de 12 heures avant le début</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Avis */}
            <section className="details-card">
              <div className="card-icon">⭐</div>
              <h2 className="card-title">Avis des participants</h2>
              <div className="reviews-summary">
                <div className="summary-score">
                  <div className="score-big">{activity.rating || 4.5}</div>
                  <div className="score-stars">{'⭐'.repeat(Math.floor(activity.rating || 4))}</div>
                  <div className="score-label">Excellent</div>
                  <div className="score-count">{activity.reviewsCount || 0} avis</div>
                </div>
                <div className="summary-breakdown">
                  <div className="breakdown-row">
                    <span>Organisation</span>
                    <div className="breakdown-bar"><div className="bar-fill" style={{width: '95%'}}></div></div>
                    <span>4.8</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Guide</span>
                    <div className="breakdown-bar"><div className="bar-fill" style={{width: '98%'}}></div></div>
                    <span>4.9</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Rapport qualité/prix</span>
                    <div className="breakdown-bar"><div className="bar-fill" style={{width: '90%'}}></div></div>
                    <span>4.5</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/reviews/activities/${id}`)} 
                className="btn btn-secondary"
              >
                Voir tous les avis
              </button>
            </section>
          </div>

          {/* Sidebar réservation */}
          <aside className="booking-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <div className="sidebar-price">
                  <span className="price-amount">{activity.price} DT</span>
                  <span className="price-label">par personne</span>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Participants</label>
                  <div className="quantity-control">
                    <button 
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{participants}</span>
                    <button 
                      onClick={() => setParticipants(Math.min(20, participants + 1))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="price-summary">
                  <div className="summary-row">
                    <span>{activity.price} DT × {participants} personne{participants > 1 ? 's' : ''}</span>
                    <span>{activity.price * participants} DT</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>{activity.price * participants} DT</span>
                  </div>
                </div>

                <div className="sidebar-actions">
                  <button onClick={handleAddToCart} className="btn btn-secondary btn-full">
                    Ajouter au panier
                  </button>
                  <button onClick={handleBooking} className="btn btn-primary btn-full">
                    Réserver
                  </button>
                </div>

                <div className="sidebar-features">
                  <div className="feature">✓ Confirmation immédiate</div>
                  <div className="feature">✓ Annulation gratuite 24h</div>
                  <div className="feature">✓ Guide professionnel</div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="sidebar-card contact-card">
              <h3>Une question ?</h3>
              <p>Notre équipe est à votre disposition</p>
              <button className="btn btn-secondary btn-full">
                📞 Nous contacter
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;