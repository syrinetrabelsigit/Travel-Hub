import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';
import stripeService from '../../services/stripeService';

function StripePaymentForm({ amount, bookingId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe n\'est pas encore chargé');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🔵 Étape 1: Création du PaymentIntent...');
      
      // 1. Créer Payment Intent via le backend
      const paymentResponse = await stripeService.createPaymentIntent(
        bookingId,
        amount,
        'eur'
      );

      console.log('✅ PaymentIntent créé:', paymentResponse);
      console.log('🔵 Étape 2: Confirmation du paiement avec Stripe...');

      // 2. Confirmer le paiement avec Stripe.js
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // Vous pouvez ajouter des détails de facturation ici si nécessaire
            }
          }
        }
      );

      if (stripeError) {
        console.error('❌ Erreur Stripe:', stripeError);
        throw new Error(stripeError.message);
      }

      console.log('✅ Paiement confirmé par Stripe:', paymentIntent);
      console.log('🔵 Étape 3: Confirmation au backend...');

      // 3. Confirmer au backend que le paiement a réussi
      const confirmResponse = await stripeService.confirmPayment(
        bookingId,
        paymentIntent.id
      );

      console.log('✅ Confirmation backend:', confirmResponse);
      console.log('🎉 PAIEMENT RÉUSSI !');

      // 4. Succès !
      onSuccess({
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        bookingId: bookingId
      });

    } catch (error) {
      console.error('💥 Erreur paiement:', error);
      setError(error.message || 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="payment-amount-banner">
          <span className="amount-label">Montant à payer</span>
          <span className="amount-value">{amount} €</span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Informations de carte <span className="required">*</span>
          </label>
          <div className="card-element-wrapper">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    padding: '12px',
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          <p className="card-help-text">
            💡 Utilisez une carte de test : <strong>4242 4242 4242 4242</strong>
            <br />
            Date d'expiration : n'importe quelle date future
            <br />
            CVC : n'importe quel 3 chiffres
          </p>
        </div>

        <div className="security-info">
          <span className="security-icon">🔒</span>
          <span className="security-text">Paiement 100% sécurisé par Stripe</span>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full btn-payment"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-small"></span>
              Traitement en cours...
            </>
          ) : (
            <>
              <span>🔐</span>
              Payer {amount} €
            </>
          )}
        </button>

        <div className="payment-footer">
          <div className="accepted-cards">
            <span className="footer-label">Paiement sécurisé par</span>
            <div className="stripe-badge">
              <strong>Stripe</strong>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StripePaymentForm;