import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateEmail();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Email envoyé !</h1>
            <p className="success-message">
              Un email contenant les instructions pour réinitialiser votre mot de passe 
              a été envoyé à <strong>{email}</strong>
            </p>
            <p className="success-info">
              Vérifiez votre boîte de réception et suivez les instructions.
              Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <div className="icon-wrapper">
              <span className="lock-icon">🔒</span>
            </div>
            <h1 className="forgot-password-title">Mot de passe oublié ?</h1>
            <p className="forgot-password-subtitle">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {errors.submit && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Adresse email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({});
                  }
                }}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="exemple@email.com"
                autoFocus
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>

          <div className="forgot-password-footer">
            <Link to="/login" className="back-link">
              <span className="arrow-icon">←</span>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;