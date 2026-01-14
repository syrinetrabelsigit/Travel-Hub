import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-grid">
            {/* Section 1 : À propos */}
            <div className="footer-section">
              <div className="footer-logo">
                <span className="footer-logo-icon">✈️</span>
                <span className="footer-logo-text">TravelHub</span>
              </div>
              <p className="footer-description">
                Votre plateforme de réservation tout-en-un pour des voyages inoubliables. 
                Découvrez le monde avec nous !
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">📘</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">🐦</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">📷</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">💼</span>
                </a>
              </div>
            </div>

            {/* Section 2 : Navigation */}
            <div className="footer-section">
              <h4 className="footer-title">Navigation</h4>
              <ul className="footer-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/about">À propos</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/terms">Conditions générales</Link></li>
              </ul>
            </div>

            {/* Section 3 : Services */}
            <div className="footer-section">
              <h4 className="footer-title">Nos Services</h4>
              <ul className="footer-links">
                <li><Link to="/flights">Réservation de vols</Link></li>
                <li><Link to="/hotels">Réservation d'hôtels</Link></li>
                <li><Link to="/activities">Activités touristiques</Link></li>
                <li><Link to="/deals">Offres spéciales</Link></li>
              </ul>
            </div>

            {/* Section 4 : Contact */}
            <div className="footer-section">
              <h4 className="footer-title">Contactez-nous</h4>
              <ul className="footer-contact">
                <li>
                  <span className="contact-icon">📧</span>
                  <a href="mailto:support@travelhub.com">support@travelhub.com</a>
                </li>
                <li>
                  <span className="contact-icon">📞</span>
                  <a href="tel:+123456789">+1 234 567 890</a>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span>123 Travel Street, Tunis, Tunisia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} TravelHub. Tous droits réservés.
            </p>
            <div className="footer-bottom-links">
              <Link to="/terms">Conditions d'utilisation</Link>
              <span className="separator">|</span>
              <Link to="/privacy">Politique de confidentialité</Link>
              <span className="separator">|</span>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;