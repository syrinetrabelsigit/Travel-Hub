import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './BookingForm.css';
import bookingService from '../services/bookingService';
import cartService from '../services/cartService';
import StripeWrapper from '../components/booking/StripeWrapper';
import StripePaymentForm from '../components/booking/StripePaymentForm';

function BookingForm() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: Info, 2: Paiement, 3: Confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    // Charger les infos de l'utilisateur si connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || ''
      }));
    }

    // Récupérer les détails de l'item depuis le state
    const stateData = location.state;
    if (stateData) {
      setItemDetails(stateData);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (!formData.country) newErrors.country = 'Le pays est requis';

    return newErrors;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const newErrors = validateStep1();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        // Ajouter l'item au panier si ce n'est pas déjà fait
        const cartItem = {
          type: type.slice(0, -1), // "flights" -> "flight"
          itemId: id,
          data: itemDetails,
          price: itemDetails?.price || 0,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        
        await cartService.addItem(cartItem);

        // Créer la réservation (le backend récupère automatiquement le panier)
        const booking = await bookingService.createBooking();
        setBookingId(booking.id);
        
        setStep(2);
      } catch (error) {
        console.error('Erreur:', error);
        setErrors({ submit: error.message || 'Erreur lors de la création de la réservation' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    console.log('✅ Paiement réussi, redirection...');
    navigate(`/booking/confirmation/${bookingId}`);
  };

  const getItemTypeLabel = () => {
    switch(type) {
      case 'flights': return 'Vol';
      case 'hotels': return 'Hôtel';
      case 'activities': return 'Activité';
      default: return 'Réservation';
    }
  };

  return (
    <div className="booking-form-page">
      <div className="container">
        {/* Stepper */}
        <div className="booking-stepper">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Informations</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Paiement</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-main">
            <div className="booking-card">
              <h1 className="booking-title">
                Réservation - {getItemTypeLabel()}
              </h1>

              {/* Étape 1: Informations */}
              {step === 1 && (
                <form className="booking-form">
                  {errors.submit && (
                    <div className="alert alert-error">
                      <span className="alert-icon">⚠️</span>
                      {errors.submit}
                    </div>
                  )}

                  <h2 className="section-title">Informations personnelles</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Prénom <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="Jean"
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Nom <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Dupont"
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="exemple@email.com"
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Téléphone <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="+216 12 345 678"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>

                  <h2 className="section-title">Adresse</h2>
                  <div className="form-group">
                    <label className="form-label">
                      Adresse complète <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${errors.address ? 'input-error' : ''}`}
                      placeholder="123 Rue de la Liberté"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Ville <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`form-input ${errors.city ? 'input-error' : ''}`}
                        placeholder="Tunis"
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Code postal <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`form-input ${errors.postalCode ? 'input-error' : ''}`}
                        placeholder="1000"
                      />
                      {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Pays <span className="required">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`form-input ${errors.country ? 'input-error' : ''}`}
                    >
                      <option value="">Sélectionnez un pays</option>
                      <option value="TN">Tunisie</option>
                      <option value="FR">France</option>
                      <option value="MA">Maroc</option>
                      <option value="DZ">Algérie</option>
                      <option value="US">États-Unis</option>
                      <option value="CA">Canada</option>
                      <option value="GB">Royaume-Uni</option>
                      <option value="DE">Allemagne</option>
                      <option value="ES">Espagne</option>
                      <option value="IT">Italie</option>
                    </select>
                    {errors.country && <span className="error-message">{errors.country}</span>}
                  </div>

                  <h2 className="section-title">Demandes spéciales (optionnel)</h2>
                  <div className="form-group">
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Avez-vous des demandes particulières ?"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => navigate(-1)} 
                      className="btn btn-secondary"
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextStep} 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Chargement...' : 'Continuer vers le paiement'}
                    </button>
                  </div>
                </form>
              )}

              {/* Étape 2: Paiement */}
              {step === 2 && bookingId && (
                <div className="payment-step">
                  <h2 className="section-title">Paiement sécurisé</h2>
                  <p className="payment-info">
                    Vos informations de paiement sont sécurisées et cryptées par Stripe
                  </p>

                  <StripeWrapper>
                    <StripePaymentForm 
                      amount={itemDetails?.price || 0}
                      bookingId={bookingId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </StripeWrapper>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep} 
                      className="btn btn-secondary"
                    >
                      Retour
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar récapitulatif */}
          <aside className="booking-sidebar">
            <div className="summary-card">
              <h3 className="summary-title">Récapitulatif</h3>
              
              <div className="summary-item">
                <span className="summary-label">Type:</span>
                <span className="summary-value">{getItemTypeLabel()}</span>
              </div>

              {itemDetails?.selectedDate && (
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">{itemDetails.selectedDate}</span>
                </div>
              )}

              {itemDetails?.participants && (
                <div className="summary-item">
                  <span className="summary-label">Participants:</span>
                  <span className="summary-value">{itemDetails.participants}</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-amount">{itemDetails?.price || 0} €</span>
              </div>

              <div className="summary-features">
                <div className="feature">✓ Confirmation immédiate</div>
                <div className="feature">✓ Annulation gratuite 24h</div>
                <div className="feature">✓ Paiement sécurisé</div>
              </div>
            </div>

            <div className="help-card">
              <h4>Besoin d'aide ?</h4>
              <p>Notre équipe est disponible 24h/24</p>
              <button className="btn btn-secondary btn-full">
                📞 Contactez-nous
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;