import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.getBooking(id);
      setBooking(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await bookingService.downloadInvoice(id);
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <LoadingSpinner text="Chargement de votre réservation..." />;

  if (!booking) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Réservation non trouvée</h2>
        <p>Impossible de trouver votre réservation.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          {/* En-tête de succès */}
          <div className="success-header">
            <div className="success-animation">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            <h1 className="success-title">Réservation confirmée !</h1>
            <p className="success-message">
              Votre réservation a été effectuée avec succès.
              Un email de confirmation a été envoyé à <strong>{booking.email || 'votre adresse email'}</strong>
            </p>
          </div>

          {/* Détails de la réservation */}
          <div className="confirmation-details">
            <div className="details-card">
              <div className="card-header">
                <h2>Détails de la réservation</h2>
                <span className="booking-number">N° {booking.id || id}</span>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Type de réservation</span>
                  <span className="detail-value">
                    {booking.type === 'flights' ? '✈️ Vol' : 
                     booking.type === 'hotels' ? '🏨 Hôtel' : 
                     booking.type === 'activities' ? '🎯 Activité' : 'Réservation'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Date de réservation</span>
                  <span className="detail-value">
                    {new Date().toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Statut</span>
                  <span className="detail-value status-confirmed">
                    <span className="status-dot"></span>
                    Confirmé
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Montant total</span>
                  <span className="detail-value price-value">
                    {booking.totalAmount || 0} DT
                  </span>
                </div>
              </div>
            </div>

            {/* Informations du voyageur */}
            <div className="details-card">
              <h2 className="card-title">Informations du voyageur</h2>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">👤</div>
                  <div className="info-content">
                    <div className="info-label">Nom complet</div>
                    <div className="info-value">
                      {booking.firstName || 'Prénom'} {booking.lastName || 'Nom'}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-content">
                    <div className="info-label">Email</div>
                    <div className="info-value">{booking.email || 'email@example.com'}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📱</div>
                  <div className="info-content">
                    <div className="info-label">Téléphone</div>
                    <div className="info-value">{booking.phone || '+216 00 000 000'}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <div className="info-label">Adresse</div>
                    <div className="info-value">
                      {booking.address || 'Adresse'}, {booking.city || 'Ville'}, {booking.country || 'Pays'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="details-card next-steps">
              <h2 className="card-title">📋 Prochaines étapes</h2>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Vérifiez votre email</h4>
                    <p>Vous recevrez un email de confirmation avec tous les détails de votre réservation</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Préparez vos documents</h4>
                    <p>Assurez-vous d'avoir tous les documents nécessaires (passeport, visa si requis)</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Suivez votre réservation</h4>
                    <p>Vous pouvez consulter et gérer votre réservation depuis votre compte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="confirmation-actions">
              <button onClick={handleDownloadPDF} className="btn btn-secondary">
                <span>📄</span> Télécharger le PDF
              </button>
              <button onClick={handlePrint} className="btn btn-secondary">
                <span>🖨️</span> Imprimer
              </button>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                <span>🏠</span> Retour à l'accueil
              </button>
            </div>

            {/* Informations supplémentaires */}
            <div className="info-boxes">
              <div className="info-box">
                <div className="info-box-icon">💡</div>
                <div className="info-box-content">
                  <h4>Besoin d'aide ?</h4>
                  <p>Notre service client est disponible 24h/24 pour répondre à vos questions</p>
                  <button className="link-btn">Contactez-nous →</button>
                </div>
              </div>

              <div className="info-box">
                <div className="info-box-icon">⭐</div>
                <div className="info-box-content">
                  <h4>Laissez un avis</h4>
                  <p>Partagez votre expérience pour aider d'autres voyageurs</p>
                  <button 
                    className="link-btn"
                    onClick={() => navigate(`/reviews/${booking.type}/${booking.itemId}`)}
                  >
                    Donner mon avis →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;