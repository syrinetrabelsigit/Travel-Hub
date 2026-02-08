import React, { useState } from 'react';
import './PaymentForm.css';
import stripeService from '../../services/stripeService';

function PaymentForm({ amount, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors = {};

    // Numéro de carte
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Le numéro de carte est requis';
    } else if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres';
    } else if (!/^\d+$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir uniquement des chiffres';
    }

    // Nom sur la carte
    if (!cardName.trim()) {
      newErrors.cardName = 'Le nom sur la carte est requis';
    }

    // Date d'expiration
    if (!expiryDate) {
      newErrors.expiryDate = 'La date d\'expiration est requise';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Format invalide (MM/AA)';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Mois invalide';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Carte expirée';
      }
    }

    // CVV
    if (!cvv) {
      newErrors.cvv = 'Le CVV est requis';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV invalide (3 ou 4 chiffres)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Créer un token de paiement
      const paymentMethod = await stripeService.createPaymentMethod({
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardName,
        expiryDate,
        cvv
      });

      // Confirmer le paiement
      await stripeService.confirmPayment(paymentMethod.id, amount);

      // Succès
      onSuccess(paymentMethod);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors du paiement' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-amount-banner">
        <span className="amount-label">Montant à payer</span>
        <span className="amount-value">{amount} DT</span>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        {errors.submit && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {errors.submit}
          </div>
        )}

        <div className="card-preview">
          <div className="card-front">
            <div className="card-chip"></div>
            <div className="card-number">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="card-info">
              <div className="card-holder">
                <div className="label">Titulaire</div>
                <div className="value">{cardName || 'NOM PRÉNOM'}</div>
              </div>
              <div className="card-expiry">
                <div className="label">Expire</div>
                <div className="value">{expiryDate || 'MM/AA'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber" className="form-label">
            Numéro de carte <span className="required">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon">💳</span>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cardName" className="form-label">
            Nom sur la carte <span className="required">*</span>
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            className={`form-input ${errors.cardName ? 'input-error' : ''}`}
            placeholder="JEAN DUPONT"
          />
          {errors.cardName && <span className="error-message">{errors.cardName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate" className="form-label">
              Date d'expiration <span className="required">*</span>
            </label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className={`form-input ${errors.expiryDate ? 'input-error' : ''}`}
              placeholder="MM/AA"
              maxLength="5"
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cvv" className="form-label">
              CVV <span className="required">*</span>
            </label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={`form-input ${errors.cvv ? 'input-error' : ''}`}
              placeholder="123"
              maxLength="4"
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>

        <div className="security-info">
          <span className="security-icon">🔒</span>
          <span className="security-text">Paiement 100% sécurisé et crypté</span>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-full btn-payment"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-small"></span>
              Traitement en cours...
            </>
          ) : (
            <>
              <span>🔐</span>
              Payer {amount} DT
            </>
          )}
        </button>
      </form>

      <div className="payment-footer">
        <div className="accepted-cards">
          <span className="footer-label">Nous acceptons:</span>
          <div className="card-logos">
            <span className="card-logo">💳 VISA</span>
            <span className="card-logo">💳 MC</span>
            <span className="card-logo">💳 AMEX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;