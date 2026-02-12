import React, { useState } from 'react';
import './Contact.css';
import contactService from '../services/contactService';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await contactService.sendMessage(formData);
    alert('✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    alert('❌ Erreur lors de l\'envoi du message. Veuillez réessayer.');
  }
};

  const contactMethods = [
    {
      id: 1,
      icon: '📧',
      title: 'Email',
      value: 'support@travelhub.com',
      description: 'Envoyez-nous un email, nous répondons sous 24h'
    },
    {
      id: 2,
      icon: '📞',
      title: 'Téléphone',
      value: '+216 71 123 456',
      description: 'Disponible du lundi au vendredi, 9h-18h'
    },
    {
      id: 3,
      icon: '📍',
      title: 'Adresse',
      value: '123 Avenue Habib Bourguiba, Tunis',
      description: 'Visitez nos bureaux sur rendez-vous'
    },
    {
      id: 4,
      icon: '💬',
      title: 'Chat en direct',
      value: 'Support 24/7',
      description: 'Chattez avec notre équipe en temps réel'
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: 'Comment puis-je modifier ma réservation ?',
      answer: 'Connectez-vous à votre compte, accédez à "Mes réservations" et cliquez sur "Modifier".'
    },
    {
      id: 2,
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires.'
    },
    {
      id: 3,
      question: 'Puis-je annuler ma réservation ?',
      answer: 'Oui, selon les conditions d\'annulation de votre réservation. Consultez les détails dans votre confirmation.'
    },
    {
      id: 4,
      question: 'Comment contacter le service client ?',
      answer: 'Par email, téléphone, chat en direct ou via le formulaire de contact sur cette page.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Contactez-nous</h1>
          <p className="contact-hero-subtitle">
            Notre équipe est là pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <div className="methods-grid">
            {contactMethods.map(method => (
              <div key={method.id} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3 className="method-title">{method.title}</h3>
                <p className="method-value">{method.value}</p>
                <p className="method-description">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-content">
            <div className="form-info">
              <h2 className="form-info-title">Envoyez-nous un message</h2>
              <p className="form-info-description">
                Remplissez le formulaire ci-contre et nous vous répondrons dans les plus brefs délais. 
                Notre équipe est disponible pour vous aider avec toutes vos questions concernant vos réservations.
              </p>
              <div className="form-features">
                <div className="form-feature">
                  <span className="feature-icon">✓</span>
                  <span>Réponse sous 24h</span>
                </div>
                <div className="form-feature">
                  <span className="feature-icon">✓</span>
                  <span>Support multilingue</span>
                </div>
                <div className="form-feature">
                  <span className="feature-icon">✓</span>
                  <span>Équipe expérimentée</span>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Sujet *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">Question sur une réservation</option>
                    <option value="modification">Modification de réservation</option>
                    <option value="annulation">Annulation</option>
                    <option value="paiement">Problème de paiement</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                <span>Envoyer le message</span>
                <span className="send-icon">✉️</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="container">
          <h2 className="section-title text-center">Questions Fréquentes</h2>
          <p className="section-subtitle text-center">
            Trouvez rapidement des réponses à vos questions
          </p>
          <div className="faq-grid">
            {faqItems.map(item => (
              <div key={item.id} className="faq-item">
                <h3 className="faq-question">
                  <span className="faq-icon">❓</span>
                  {item.question}
                </h3>
                <p className="faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="contact-map">
        <div className="container">
          <h2 className="section-title text-center">Où nous trouver</h2>
          <div className="map-placeholder">
            <iframe
              title="TravelHub Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.9732542933935!2d10.181663815314942!3d36.80614597993907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34891b7775cd%3A0x38e9b6d6f3b6e64!2sAvenue%20Habib%20Bourguiba%2C%20Tunis!5e0!3m2!1sen!2stn!4v1635000000000!5m2!1sen!2stn"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;