import React, { useState } from 'react';
import './OrderSummary.css';
import { Link, useNavigate } from 'react-router-dom';

function OrderSummary() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Info voyageurs, 2: Paiement, 3: Confirmation

  const [orderData] = useState({
    items: [
      {
        id: 1,
        type: 'flight',
        title: 'Vol Paris - New York',
        airline: 'Air France',
        departure: '2025-02-15',
        passengers: 2,
        price: 900
      },
      {
        id: 2,
        type: 'hotel',
        title: 'Hôtel Le Grand New York',
        location: 'Manhattan, New York',
        nights: 5,
        price: 900
      },
      {
        id: 3,
        type: 'activity',
        title: 'Visite Statue de la Liberté',
        participants: 2,
        price: 150
      }
    ],
    subtotal: 1950,
    discount: 195,
    tax: 87.75,
    total: 1842.75
  });

  const [travelers, setTravelers] = useState([
    { firstName: '', lastName: '', dateOfBirth: '', passportNumber: '', email: '' },
    { firstName: '', lastName: '', dateOfBirth: '', passportNumber: '', email: '' }
  ]);

  const [billingInfo, setBillingInfo] = useState({
    address: '',
    city: '',
    zipCode: '',
    country: 'Tunisie'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingReference] = useState('TH' + Date.now());

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleBillingChange = (field, value) => {
    setBillingInfo({ ...billingInfo, [field]: value });
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo({ ...paymentInfo, [field]: value });
  };

  const validateStep1 = () => {
    return travelers.every(t => t.firstName && t.lastName && t.email);
  };

  const validateStep2 = () => {
    return (
      paymentInfo.cardNumber &&
      paymentInfo.cardName &&
      paymentInfo.expiryDate &&
      paymentInfo.cvv &&
      billingInfo.address &&
      billingInfo.city &&
      agreedToTerms
    );
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'activity': return '🎯';
      default: return '📦';
    }
  };

  return (
    <div className="order-summary-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Informations voyageurs</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Paiement</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        <div className="order-layout">
          {/* Main Content */}
          <div className="order-main">
            {/* STEP 1: Informations voyageurs */}
            {step === 1 && (
              <div className="order-step">
                <h2 className="step-title">
                  <span className="title-icon">👥</span>
                  Informations des voyageurs
                </h2>

                {travelers.map((traveler, index) => (
                  <div key={index} className="traveler-form">
                    <h3 className="traveler-form-title">Voyageur {index + 1}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Prénom *</label>
                        <input
                          type="text"
                          value={traveler.firstName}
                          onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                          placeholder="Prénom"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nom *</label>
                        <input
                          type="text"
                          value={traveler.lastName}
                          onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                          placeholder="Nom"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Date de naissance</label>
                        <input
                          type="date"
                          value={traveler.dateOfBirth}
                          onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Numéro de passeport</label>
                        <input
                          type="text"
                          value={traveler.passportNumber}
                          onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                          placeholder="AB123456"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={traveler.email}
                          onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="step-actions">
                  <Link to="/cart" className="btn-back">
                    ← Retour au panier
                  </Link>
                  <button className="btn-next" onClick={handleNextStep}>
                    Continuer
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Paiement */}
            {step === 2 && (
              <div className="order-step">
                <h2 className="step-title">
                  <span className="title-icon">💳</span>
                  Informations de paiement
                </h2>

                {/* Billing Address */}
                <div className="billing-section">
                  <h3 className="section-subtitle">Adresse de facturation</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Adresse *</label>
                      <input
                        type="text"
                        value={billingInfo.address}
                        onChange={(e) => handleBillingChange('address', e.target.value)}
                        placeholder="123 Rue Example"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Ville *</label>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                        placeholder="Tunis"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Code postal *</label>
                      <input
                        type="text"
                        value={billingInfo.zipCode}
                        onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                        placeholder="1000"
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Pays *</label>
                      <select
                        value={billingInfo.country}
                        onChange={(e) => handleBillingChange('country', e.target.value)}
                      >
                        <option value="Tunisie">Tunisie</option>
                        <option value="France">France</option>
                        <option value="Maroc">Maroc</option>
                        <option value="Algérie">Algérie</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="payment-section">
                  <h3 className="section-subtitle">Informations de carte</h3>
                  <div className="payment-cards">
                    <span className="card-icon">💳 Visa</span>
                    <span className="card-icon">💳 Mastercard</span>
                    <span className="card-icon">💳 Amex</span>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Numéro de carte *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Nom sur la carte *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                        placeholder="SYRINE TRABELSI"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date d'expiration *</label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="terms-section">
                  <label className="checkbox-label-large">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span>
                      J'accepte les{' '}
                      <Link to="/terms" target="_blank">conditions générales</Link>
                      {' '}et la{' '}
                      <Link to="/privacy" target="_blank">politique de confidentialité</Link>
                    </span>
                  </label>
                </div>

                <div className="step-actions">
                  <button className="btn-back" onClick={handlePreviousStep}>
                    ← Retour
                  </button>
                  <button className="btn-pay" onClick={handleNextStep}>
                    <span className="lock-icon">🔒</span>
                    Payer {orderData.total.toFixed(2)}€
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="order-step confirmation-step">
                <div className="confirmation-icon">✅</div>
                <h2 className="confirmation-title">Réservation confirmée !</h2>
                <p className="confirmation-text">
                  Merci pour votre réservation. Un email de confirmation a été envoyé à votre adresse.
                </p>

                <div className="booking-ref-card">
                  <h3>Référence de réservation</h3>
                  <div className="booking-ref-number">{bookingReference}</div>
                  <p className="booking-ref-info">
                    Conservez cette référence pour suivre votre réservation
                  </p>
                </div>

                <div className="confirmation-details">
                  <h3 className="details-title">Détails de votre réservation</h3>
                  <div className="confirmation-items">
                    {orderData.items.map(item => (
                      <div key={item.id} className="confirmation-item">
                        <span className="item-icon">{getItemIcon(item.type)}</span>
                        <span className="item-name">{item.title}</span>
                        <span className="item-price">{item.price}€</span>
                      </div>
                    ))}
                  </div>

                  <div className="confirmation-total">
                    <span>Total payé</span>
                    <span className="total-amount">{orderData.total.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button className="btn-download">
                    <span className="download-icon">📥</span>
                    Télécharger la confirmation
                  </button>
                  <Link to="/booking-history" className="btn-view-bookings">
                    Voir mes réservations
                  </Link>
                  <Link to="/" className="btn-home">
                    Retour à l'accueil
                  </Link>
                </div>

                <div className="next-steps">
                  <h3 className="next-steps-title">Prochaines étapes</h3>
                  <div className="next-steps-list">
                    <div className="next-step-item">
                      <span className="step-icon">📧</span>
                      <div className="step-content">
                        <h4>Vérifiez vos emails</h4>
                        <p>Vous recevrez tous les détails par email</p>
                      </div>
                    </div>
                    <div className="next-step-item">
                      <span className="step-icon">📱</span>
                      <div className="step-content">
                        <h4>Téléchargez vos billets</h4>
                        <p>Disponibles dans "Mes réservations"</p>
                      </div>
                    </div>
                    <div className="next-step-item">
                      <span className="step-icon">✈️</span>
                      <div className="step-content">
                        <h4>Préparez votre voyage</h4>
                        <p>Vérifiez vos documents de voyage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Sidebar */}
          <div className="order-sidebar">
            <div className="order-summary-card">
              <h3 className="summary-card-title">Récapitulatif</h3>

              <div className="summary-items">
                {orderData.items.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-icon">{getItemIcon(item.type)}</span>
                    <div className="item-info">
                      <div className="item-name">{item.title}</div>
                      <div className="item-price">{item.price}€</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Sous-total</span>
                  <span>{orderData.subtotal.toFixed(2)}€</span>
                </div>
                <div className="breakdown-row discount">
                  <span>Réduction</span>
                  <span>-{orderData.discount.toFixed(2)}€</span>
                </div>
                <div className="breakdown-row">
                  <span>Taxes</span>
                  <span>{orderData.tax.toFixed(2)}€</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total</span>
                  <span>{orderData.total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="security-badges">
                <div className="security-badge">
                  <span className="badge-icon">🔒</span>
                  <span>Paiement sécurisé SSL</span>
                </div>
                <div className="security-badge">
                  <span className="badge-icon">✓</span>
                  <span>Garantie meilleur prix</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;