import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import './ResetPassword.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Le mot de passe est requis';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.resetPassword(token, formData.newPassword);
      setIsSuccess(true);
    } catch (error) {
      console.error('Erreur reset password:', error);
      setErrors({ 
        submit: error.message || 'Le lien a expiré ou est invalide. Veuillez redemander un nouveau lien.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Mot de passe réinitialisé !</h1>
            <p className="success-message">
              Votre mot de passe a été réinitialisé avec succès.
            </p>
            <p className="success-info">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary btn-full"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <div className="icon-wrapper">
              <span className="key-icon">🔑</span>
            </div>
            <h1 className="reset-password-title">Nouveau mot de passe</h1>
            <p className="reset-password-subtitle">
              Créez un nouveau mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reset-password-form">
            {errors.submit && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                placeholder="Minimum 6 caractères"
                autoFocus
              />
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Retapez votre mot de passe"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="password-requirements">
              <p className="requirements-title">Le mot de passe doit contenir :</p>
              <ul className="requirements-list">
                <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
                  {formData.newPassword.length >= 6 ? '✓' : '○'} Au moins 6 caractères
                </li>
                <li className={formData.newPassword && formData.newPassword === formData.confirmPassword ? 'valid' : ''}>
                  {formData.newPassword && formData.newPassword === formData.confirmPassword ? '✓' : '○'} Les mots de passe correspondent
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <div className="reset-password-footer">
            <a href="/login" className="back-link">
              <span className="arrow-icon">←</span>
              Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;