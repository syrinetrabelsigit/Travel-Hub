import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    // Nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Téléphone
    if (!formData.phone) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide (min 8 chiffres)';
    }

    // Date de naissance
    if (!formData.birthDate) {
      newErrors.birthDate = 'La date de naissance est requise';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birthDate = 'Vous devez avoir au moins 18 ans';
      }
    }

    // Nationalité
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'La nationalité est requise';
    }

    // Adresse
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    // Ville
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    // Code postal
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    } else if (!/^[0-9]{4,}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide';
    }

    // Pays
    if (!formData.country) {
      newErrors.country = 'Le pays est requis';
    }

    // Mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir des majuscules, minuscules et chiffres';
    }

    // Confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Conditions
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
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

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          nationality: formData.nationality,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Créer un compte</h1>
            <p className="register-subtitle">Rejoignez TravelHub et commencez votre aventure</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {errors.submit && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="form-sections-grid">
              {/* Section: Informations personnelles - COLONNE GAUCHE */}
              <div className="form-section">
                <h3 className="section-title">Informations personnelles</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      Prénom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                      placeholder="Jean"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                      placeholder="Dupont"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="birthDate" className="form-label">
                      Date de naissance <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={`form-input ${errors.birthDate ? 'input-error' : ''}`}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    />
                    {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="nationality" className="form-label">
                      Nationalité <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className={`form-input ${errors.nationality ? 'input-error' : ''}`}
                      placeholder="Tunisienne"
                    />
                    {errors.nationality && <span className="error-message">{errors.nationality}</span>}
                  </div>
                </div>
              </div>

              {/* Section: Contact - COLONNE DROITE */}
              <div className="form-section">
                <h3 className="section-title">Contact</h3>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Adresse email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="exemple@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Téléphone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="+216 12 345 678"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {/* Section: Adresse - DEUXIÈME LIGNE, COLONNE GAUCHE */}
              <div className="form-section">
                <h3 className="section-title">Adresse</h3>
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Adresse complète <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${errors.address ? 'input-error' : ''}`}
                    placeholder="123 Rue de la Liberté"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      Ville <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`form-input ${errors.city ? 'input-error' : ''}`}
                      placeholder="Tunis"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode" className="form-label">
                      Code postal <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
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
                  <label htmlFor="country" className="form-label">
                    Pays <span className="required">*</span>
                  </label>
                  <select
                    id="country"
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
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="AE">Émirats Arabes Unis</option>
                    <option value="SA">Arabie Saoudite</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
              </div>

              {/* Section: Sécurité - DEUXIÈME LIGNE, COLONNE DROITE */}
              <div className="form-section">
                <h3 className="section-title">Sécurité</h3>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Mot de passe <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                  <div className="password-strength">
                    <small>Doit contenir au moins 8 caractères, majuscules, minuscules et chiffres</small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmer le mot de passe <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

            {/* Conditions - Prend toute la largeur */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>
                  J'accepte les{' '}
                  <Link to="/terms" className="link-primary" target="_blank">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="link-primary" target="_blank">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="register-footer">
            <p className="footer-text">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="link-primary">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;