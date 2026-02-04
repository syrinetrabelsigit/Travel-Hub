import React from 'react';
import { useNavigate } from 'react-router-dom'; // AJOUT
import './Home.css';
import HeroSection from '../components/home/HeroSection';
import DestinationCard from '../components/home/DestinationCard';

function Home() {
  const navigate = useNavigate(); // AJOUT

  // Données des destinations populaires
  const popularDestinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      description: 'La ville de l\'amour et des lumières',
      price: 299,
      rating: 4.8,
      reviews: 1250
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japon',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      description: 'Tradition et modernité',
      price: 899,
      rating: 4.9,
      reviews: 2100
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      description: 'La ville qui ne dort jamais',
      price: 599,
      rating: 4.7,
      reviews: 1800
    }
  ];

  // Données des offres spéciales
  const specialOffers = [
    {
      id: 1,
      title: 'Économisez 20% sur les vols vers Paris',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      discount: '20%',
      validUntil: '31 Déc 2025'
    },
    {
      id: 2,
      title: 'Séjours de luxe aux Maldives dès 299DT',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600',
      discount: '299DT',
      validUntil: '15 Jan 2026'
    },
    {
      id: 3,
      title: 'Forfaits tout compris dans les Alpes dès 199DT',
      image: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=600',
      discount: '199DT',
      validUntil: '28 Fév 2026'
    }
  ];

  // Témoignages clients
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Martin',
      avatar: '👩',
      comment: 'TravelHub a rendu notre lune de miel inoubliable !',
      rating: 5,
      location: 'Paris, France'
    },
    {
      id: 2,
      name: 'Ahmed Ben Ali',
      avatar: '👨',
      comment: 'Meilleurs prix et service client exceptionnel.',
      rating: 5,
      location: 'Tunis, Tunisie'
    },
    {
      id: 3,
      name: 'Lisa Chen',
      avatar: '👩',
      comment: 'Interface intuitive et offres incroyables.',
      rating: 5,
      location: 'New York, USA'
    }
  ];

  // AJOUT : Fonction pour gérer la réservation d'offres
  const handleOfferBooking = (offer) => {
    navigate('/search'); // Rediriger vers votre page de recherche
  };

  // AJOUT : Fonction pour l'inscription à la newsletter
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <HeroSection />

      {/* Destinations Populaires */}
      <section className="popular-destinations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Destinations Populaires</h2>
            <p className="section-subtitle">
              Découvrez les destinations les plus prisées par nos voyageurs
            </p>
          </div>
          <div className="destinations-grid">
            {popularDestinations.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Offres Spéciales */}
      <section className="special-offers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Offres Spéciales</h2>
            <p className="section-subtitle">
              Profitez de nos meilleures offres
            </p>
          </div>
          <div className="offers-grid">
            {specialOffers.map(offer => (
              <div key={offer.id} className="offer-card">
                <div className="offer-image">
                  <img src={offer.image} alt={offer.title} />
                  <div className="offer-badge">{offer.discount}</div>
                </div>
                <div className="offer-content">
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-validity">
                    <span className="validity-icon">⏰</span>
                    Valable jusqu'au {offer.validUntil}
                  </p>
                  {/* MODIFIÉ : Ajout de la fonction onClick */}
                  <button 
                    className="btn-offer"
                    onClick={() => handleOfferBooking(offer)}
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi TravelHub */}
      <section className="why-travelhub">
        <div className="container">
          <h2 className="section-title">Pourquoi choisir TravelHub ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Meilleurs Prix</h3>
              <p className="feature-description">
                Nous comparons des centaines d'offres
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Paiement Sécurisé</h3>
              <p className="feature-description">
                Vos transactions sont protégées
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Réservation Facile</h3>
              <p className="feature-description">
                Interface simple et intuitive
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Destinations Variées</h3>
              <p className="feature-description">
                Des milliers de destinations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-location">{testimonial.location}</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">Restez informé de nos offres</h2>
              <p className="newsletter-subtitle">
                Inscrivez-vous à notre newsletter
              </p>
            </div>
            {/* MODIFIÉ : Ajout de onSubmit */}
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;