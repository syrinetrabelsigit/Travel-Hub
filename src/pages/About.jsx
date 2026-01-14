import React from 'react';
import './About.css';

function About() {
  const teamMembers = [
    {
      id: 1,
      name: 'Syrine Trabelsi',
      role: 'Développeuse Frontend',
      avatar: '👩‍💻',
      description: 'Spécialisée en React et design UI/UX'
    },
    {
      id: 2,
      name: 'Cyrine Sammouda',
      role: 'Développeuse Frontend',
      avatar: '👩‍💻',
      description: 'Experte en intégration API et React'
    },
    {
      id: 3,
      name: 'Yassine Skik',
      role: 'Développeur Backend',
      avatar: '👨‍💻',
      description: 'Spécialisé en Spring Boot et APIs'
    },
    {
      id: 4,
      name: 'Mohamed Hachem Jaibi',
      role: 'Développeur Backend',
      avatar: '👨‍💻',
      description: 'Expert en MongoDB et authentification'
    }
  ];

  const values = [
    {
      id: 1,
      icon: '🎯',
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque aspect de notre service pour offrir la meilleure expérience à nos clients.'
    },
    {
      id: 2,
      icon: '🤝',
      title: 'Confiance',
      description: 'La confiance de nos clients est notre priorité. Nous garantissons transparence et sécurité dans toutes nos transactions.'
    },
    {
      id: 3,
      icon: '💡',
      title: 'Innovation',
      description: 'Nous innovons constamment pour simplifier vos réservations et améliorer votre expérience de voyage.'
    },
    {
      id: 4,
      icon: '🌍',
      title: 'Accessibilité',
      description: 'Nous rendons les voyages accessibles à tous avec des prix compétitifs et une plateforme intuitive.'
    }
  ];

  const milestones = [
    {
      id: 1,
      year: '2025',
      title: 'Lancement de TravelHub',
      description: 'Création de la plateforme de réservation tout-en-un'
    },
    {
      id: 2,
      year: '2025',
      title: 'Intégration des APIs',
      description: 'Connexion avec les principaux fournisseurs de vols et hôtels'
    },
    {
      id: 3,
      year: '2025',
      title: 'Expansion',
      description: 'Plus de 200 destinations disponibles dans le monde'
    },
    {
      id: 4,
      year: '2026',
      title: 'Objectif 100k clients',
      description: 'Notre vision pour l\'année à venir'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">À propos de TravelHub</h1>
          <p className="about-hero-subtitle">
            Votre partenaire de confiance pour des voyages inoubliables
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="section-title">Notre Mission</h2>
              <p className="mission-description">
                Chez TravelHub, notre mission est de simplifier la réservation de voyages en offrant une plateforme unique 
                où vous pouvez comparer, réserver et gérer vos vols, hôtels et activités. Nous croyons que voyager devrait 
                être accessible, simple et agréable pour tous.
              </p>
              <p className="mission-description">
                Nous nous engageons à fournir les meilleurs prix du marché en comparant des centaines d'offres, tout en 
                garantissant un service client exceptionnel et une sécurité optimale de vos données personnelles.
              </p>
              <div className="mission-stats">
                <div className="mission-stat">
                  <h3 className="stat-number">200+</h3>
                  <p className="stat-label">Destinations</p>
                </div>
                <div className="mission-stat">
                  <h3 className="stat-number">50k+</h3>
                  <p className="stat-label">Clients satisfaits</p>
                </div>
                <div className="mission-stat">
                  <h3 className="stat-number">24/7</h3>
                  <p className="stat-label">Support client</p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" 
                alt="Notre mission" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title text-center">Nos Valeurs</h2>
          <p className="section-subtitle text-center">
            Les principes qui guident notre travail au quotidien
          </p>
          <div className="values-grid">
            {values.map(value => (
              <div key={value.id} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title text-center">Notre Équipe</h2>
          <p className="section-subtitle text-center">
            Rencontrez les talents derrière TravelHub
          </p>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="about-timeline">
        <div className="container">
          <h2 className="section-title text-center">Notre Parcours</h2>
          <p className="section-subtitle text-center">
            Les étapes clés de notre développement
          </p>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à partir à l'aventure ?</h2>
            <p className="cta-description">
              Rejoignez des milliers de voyageurs satisfaits et réservez votre prochain voyage dès aujourd'hui
            </p>
            <button className="btn-cta">
              Commencer maintenant
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;