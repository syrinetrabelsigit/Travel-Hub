import React, { useState, useEffect } from 'react';
import './OrderSummary.css';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import bookingService from '../services/bookingService';
import stripeService from '../services/stripeService';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51SyehhIp57yGvBCs1ryn1Z9unOJaGfhsPeybBdOsn594S9d240WwTDWpdtOqrglVbBnwenNeI9lXQ7lQ2GpBQWYp006kvB0Rt3');

function PaymentFormStripe({ orderData, travelers, billingInfo, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Créer une réservation (backend récupère le panier automatiquement)
      console.log('🔵 Étape 1: Création de la réservation...');
      const booking = await bookingService.createBooking();
      console.log('✅ Réservation créée:', booking);

      // 2. Créer Payment Intent avec le format attendu par votre backend
      console.log('🔵 Étape 2: Création du PaymentIntent...');
      const paymentResponse = await stripeService.createPaymentIntent({
        amount: Math.round(orderData.total * 100), // En centimes
        currency: 'eur',
        bookingId: booking.id
      });
      console.log('✅ PaymentIntent créé:', paymentResponse);

      // 3. Confirmer le paiement avec Stripe
      console.log('🔵 Étape 3: Confirmation du paiement avec Stripe...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: billingInfo.name,
              address: {
                line1: billingInfo.address,
                city: billingInfo.city,
                postal_code: billingInfo.zipCode,
                country: billingInfo.country === 'Tunisie' ? 'TN' : 'FR'
              }
            }
          }
        }
      );

      if (stripeError) {
        console.error('❌ Erreur Stripe:', stripeError);
        throw new Error(stripeError.message);
      }

      console.log('✅ Paiement confirmé par Stripe:', paymentIntent);

      // 4. Confirmer au backend que le paiement a réussi
      console.log('🔵 Étape 4: Confirmation au backend...');
      await stripeService.confirmPayment(booking.id, paymentIntent.id);
      console.log('✅ Confirmation backend réussie');

      // 5. Succès !
      console.log('🎉 PAIEMENT RÉUSSI !');
      onSuccess(booking);

    } catch (error) {
      console.error('💥 Erreur paiement:', error);
      setError(error.message || 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Informations de carte *</label>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="card-help-text">
          💡 Carte de test : <strong>4242 4242 4242 4242</strong> | Expiration : n'importe quelle date future | CVC : 123
        </p>
      </div>

      <button
        type="submit"
        className="btn-pay"
        disabled={!stripe || isProcessing}
      >
        <span className="lock-icon">🔒</span>
        {isProcessing ? 'Traitement en cours...' : `Payer ${orderData.total.toFixed(2)}€`}
      </button>
    </form>
  );
}

function OrderSummary() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [travelers, setTravelers] = useState([
    { firstName: '', lastName: '', dateOfBirth: '', passportNumber: '', email: '' }
  ]);

  const [billingInfo, setBillingInfo] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Tunisie'
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);

      // Ajuster le nombre de voyageurs selon le panier
      const totalPassengers = data.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setTravelers(Array(totalPassengers).fill().map(() => ({
        firstName: '', lastName: '', dateOfBirth: '', passportNumber: '', email: ''
      })));

    } catch (error) {
      console.error('Erreur chargement panier:', error);
      alert('Erreur lors du chargement du panier');
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index][field] = value;
    setTravelers(updated);
  };

  const handleBillingChange = (field, value) => {
    setBillingInfo({ ...billingInfo, [field]: value });
  };

  const validateStep1 = () => {
    return travelers.every(t => t.firstName && t.lastName && t.email);
  };

  const validateStep2 = () => {
    return (
      billingInfo.name &&
      billingInfo.address &&
      billingInfo.city &&
      billingInfo.zipCode &&
      agreedToTerms
    );
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      // Le paiement Stripe gérera la transition vers step 3
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handlePaymentSuccess = async (booking) => {
    setBookingData(booking);
    setStep(3);
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

  if (isLoading) {
    return (
      <div className="order-summary-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="order-summary-page">
        <div className="container">
          <div className="empty-state">
            <h2>Votre panier est vide</h2>
            <Link to="/cart" className="btn btn-primary">Retour au panier</Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

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
            {/* STEP 1 */}
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
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nom *</label>
                        <input
                          type="text"
                          value={traveler.lastName}
                          onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
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
                        <label>N° Passeport</label>
                        <input
                          type="text"
                          value={traveler.passportNumber}
                          onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={traveler.email}
                          onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="step-actions">
                  <Link to="/cart" className="btn-back">← Retour au panier</Link>
                  <button className="btn-next" onClick={handleNextStep}>
                    Continuer <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="order-step">
                <h2 className="step-title">
                  <span className="title-icon">💳</span>
                  Informations de paiement
                </h2>

                <div className="billing-section">
                  <h3 className="section-subtitle">Adresse de facturation</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Nom complet *</label>
                      <input
                        type="text"
                        value={billingInfo.name}
                        onChange={(e) => handleBillingChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Adresse *</label>
                      <input
                        type="text"
                        value={billingInfo.address}
                        onChange={(e) => handleBillingChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Ville *</label>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Code postal *</label>
                      <input
                        type="text"
                        value={billingInfo.zipCode}
                        onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="payment-section">
                  <h3 className="section-subtitle">Paiement sécurisé par Stripe</h3>
                  <Elements stripe={stripePromise}>
                    <PaymentFormStripe
                      orderData={{ total }}
                      travelers={travelers}
                      billingInfo={billingInfo}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>

                <div className="terms-section">
                  <label className="checkbox-label-large">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span>
                      J'accepte les <Link to="/terms" target="_blank">conditions générales</Link>
                    </span>
                  </label>
                </div>

                <div className="step-actions">
                  <button className="btn-back" onClick={handlePreviousStep}>← Retour</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && bookingData && (
              <div className="order-step confirmation-step">
                <div className="confirmation-icon">✅</div>
                <h2 className="confirmation-title">Réservation confirmée !</h2>
                <p className="confirmation-text">
                  Merci pour votre réservation. Un email de confirmation a été envoyé.
                </p>

                <div className="booking-ref-card">
                  <h3>Référence</h3>
                  <div className="booking-ref-number">{bookingData.bookingReference || bookingData.id}</div>
                </div>

                <div className="confirmation-actions">
                  <Link to="/booking-history" className="btn btn-primary">
                    Voir mes réservations
                  </Link>
                  <Link to="/" className="btn btn-secondary">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="order-sidebar">
            <div className="order-summary-card">
              <h3 className="summary-card-title">Récapitulatif</h3>

              <div className="summary-items">
                {cart.items.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="item-icon">{getItemIcon(item.type)}</span>
                    <div className="item-info">
                      <div className="item-name">{item.type} - {item.itemId}</div>
                      <div className="item-price">{item.price} {cart.currency}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} {cart.currency}</span>
                </div>
                <div className="breakdown-row">
                  <span>Taxes (5%)</span>
                  <span>{tax.toFixed(2)} {cart.currency}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} {cart.currency}</span>
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