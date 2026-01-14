import React from 'react';
import './TermsConditions.css';

function TermsConditions() {
  const lastUpdate = "20 Novembre 2025";

  const sections = [
    {
      id: 1,
      title: "1. Acceptation des Conditions",
      content: [
        "En accédant et en utilisant TravelHub, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.",
        "TravelHub se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions."
      ]
    },
    {
      id: 2,
      title: "2. Services Proposés",
      content: [
        "TravelHub est une plateforme de réservation en ligne qui permet aux utilisateurs de rechercher, comparer et réserver des vols, hôtels et activités touristiques.",
        "Nous agissons en tant qu'intermédiaire entre les utilisateurs et les fournisseurs de services (compagnies aériennes, hôtels, organisateurs d'activités). Nous ne sommes pas responsables de la qualité des services fournis par ces tiers.",
        "Les prix affichés sont indicatifs et peuvent varier en fonction de la disponibilité. Le prix final est celui confirmé lors de la réservation."
      ]
    },
    {
      id: 3,
      title: "3. Création de Compte",
      content: [
        "Pour effectuer une réservation, vous devez créer un compte sur TravelHub. Vous vous engagez à fournir des informations exactes, complètes et à jour.",
        "Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.",
        "Vous devez avoir au moins 18 ans pour créer un compte et effectuer des réservations sur TravelHub."
      ]
    },
    {
      id: 4,
      title: "4. Réservations et Paiements",
      content: [
        "Toutes les réservations sont soumises à disponibilité et confirmation. Nous nous réservons le droit de refuser ou d'annuler toute réservation.",
        "Les paiements sont traités de manière sécurisée via notre partenaire Stripe. Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) et PayPal.",
        "Le montant total de votre réservation sera débité de votre compte au moment de la confirmation. Des frais de service peuvent s'appliquer.",
        "Une confirmation de réservation vous sera envoyée par email avec tous les détails de votre voyage et votre numéro de référence."
      ]
    },
    {
      id: 5,
      title: "5. Modifications et Annulations",
      content: [
        "Les conditions de modification et d'annulation varient selon le type de service réservé et les politiques des fournisseurs.",
        "Pour les vols : Les modifications et annulations sont soumises aux conditions de la compagnie aérienne. Des frais peuvent s'appliquer.",
        "Pour les hôtels : La plupart des réservations peuvent être annulées gratuitement jusqu'à 24-48h avant l'arrivée, sauf indication contraire.",
        "Pour les activités : Les conditions d'annulation sont spécifiques à chaque activité et sont indiquées lors de la réservation.",
        "Pour demander une modification ou annulation, veuillez contacter notre service client avec votre numéro de réservation."
      ]
    },
    {
      id: 6,
      title: "6. Remboursements",
      content: [
        "Les remboursements sont traités selon les conditions d'annulation applicables à votre réservation.",
        "Si vous êtes éligible à un remboursement, celui-ci sera effectué dans un délai de 7 à 14 jours ouvrables sur le mode de paiement initial.",
        "Les frais de service TravelHub ne sont généralement pas remboursables, sauf en cas d'annulation de notre part.",
        "En cas de litige concernant un remboursement, veuillez contacter notre service client."
      ]
    },
    {
      id: 7,
      title: "7. Protection des Données Personnelles",
      content: [
        "TravelHub s'engage à protéger vos données personnelles conformément au RGPD et aux lois locales sur la protection des données.",
        "Nous collectons uniquement les informations nécessaires à la fourniture de nos services : nom, email, téléphone, informations de paiement.",
        "Vos données ne seront jamais vendues à des tiers. Elles peuvent être partagées avec nos partenaires (compagnies aériennes, hôtels) uniquement dans le cadre de vos réservations.",
        "Vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles à tout moment en contactant notre service client.",
        "Pour plus d'informations, consultez notre Politique de Confidentialité."
      ]
    },
    {
      id: 8,
      title: "8. Responsabilités de l'Utilisateur",
      content: [
        "Vous vous engagez à utiliser TravelHub de manière légale et conformément aux présentes conditions.",
        "Vous êtes responsable de vérifier que vous disposez des documents nécessaires pour voyager (passeport, visa, vaccinations).",
        "Vous devez vous présenter à l'heure indiquée pour vos vols, transferts et activités. TravelHub ne peut être tenu responsable en cas de retard de votre part.",
        "Il est interdit d'utiliser la plateforme pour des activités frauduleuses, illégales ou nuisibles."
      ]
    },
    {
      id: 9,
      title: "9. Limitation de Responsabilité",
      content: [
        "TravelHub agit uniquement en tant qu'intermédiaire entre les utilisateurs et les fournisseurs de services. Nous ne sommes pas responsables des actes, erreurs, omissions ou négligences des fournisseurs.",
        "Nous ne garantissons pas que le site sera exempt d'erreurs, de virus ou autres composants nuisibles.",
        "TravelHub ne peut être tenu responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation de nos services.",
        "Notre responsabilité totale envers vous ne dépassera pas le montant payé pour votre réservation."
      ]
    },
    {
      id: 10,
      title: "10. Force Majeure",
      content: [
        "TravelHub ne peut être tenu responsable de l'inexécution de ses obligations en cas de force majeure.",
        "Sont considérés comme cas de force majeure : catastrophes naturelles, guerres, épidémies, grèves, actes gouvernementaux, pannes techniques majeures.",
        "En cas de force majeure affectant votre voyage, nous vous aiderons à trouver des solutions alternatives dans la mesure du possible."
      ]
    },
    {
      id: 11,
      title: "11. Propriété Intellectuelle",
      content: [
        "Tout le contenu présent sur TravelHub (textes, images, logos, logiciels) est protégé par les droits de propriété intellectuelle.",
        "Vous n'êtes pas autorisé à copier, reproduire, modifier, distribuer ou utiliser ce contenu sans autorisation écrite préalable.",
        "Les marques, logos et noms commerciaux affichés sur le site sont la propriété de TravelHub ou de leurs propriétaires respectifs."
      ]
    },
    {
      id: 12,
      title: "12. Résolution des Litiges",
      content: [
        "En cas de litige, nous vous encourageons à contacter d'abord notre service client pour trouver une solution amiable.",
        "Si aucune solution n'est trouvée, le litige sera soumis aux tribunaux compétents de Tunis, Tunisie.",
        "Les présentes conditions sont régies par le droit tunisien."
      ]
    },
    {
      id: 13,
      title: "13. Contact",
      content: [
        "Pour toute question concernant ces conditions générales, vous pouvez nous contacter :",
        "• Email : legal@travelhub.com",
        "• Téléphone : +216 71 123 456",
        "• Adresse : 123 Avenue Habib Bourguiba, Tunis, Tunisie"
      ]
    }
  ];

  return (
    <div className="terms-page">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="container">
          <h1 className="terms-hero-title">Conditions Générales d'Utilisation</h1>
          <p className="terms-hero-subtitle">
            Dernière mise à jour : {lastUpdate}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="terms-intro">
        <div className="container">
          <div className="intro-content">
            <div className="intro-icon">📋</div>
            <div className="intro-text">
              <h2>Bienvenue sur TravelHub</h2>
              <p>
                Les présentes conditions générales d'utilisation (ci-après "CGU") régissent votre accès et 
                votre utilisation de la plateforme TravelHub. Veuillez les lire attentivement avant d'utiliser 
                nos services. En utilisant TravelHub, vous acceptez d'être lié par ces conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="terms-content">
        <div className="container">
          <div className="terms-layout">
            {/* Table of Contents */}
            <aside className="terms-sidebar">
              <div className="sidebar-sticky">
                <h3 className="sidebar-title">Table des matières</h3>
                <nav className="terms-nav">
                  {sections.map(section => (
                    <a 
                      key={section.id} 
                      href={`#section-${section.id}`}
                      className="nav-link"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="terms-main">
              {sections.map(section => (
                <div key={section.id} id={`section-${section.id}`} className="terms-section">
                  <h2 className="section-title">{section.title}</h2>
                  <div className="section-content">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="section-paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="terms-notice">
        <div className="container">
          <div className="notice-card">
            <div className="notice-icon">⚠️</div>
            <div className="notice-content">
              <h3 className="notice-title">Important</h3>
              <p className="notice-text">
                Ces conditions générales peuvent être modifiées à tout moment. Nous vous recommandons de 
                les consulter régulièrement. En continuant à utiliser TravelHub après toute modification, 
                vous acceptez les nouvelles conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="terms-links">
        <div className="container">
          <h2 className="section-title text-center">Documents Connexes</h2>
          <div className="links-grid">
            <a href="/privacy" className="link-card">
              <div className="link-icon">🔒</div>
              <h3 className="link-title">Politique de Confidentialité</h3>
              <p className="link-description">
                Comment nous collectons et utilisons vos données personnelles
              </p>
              <span className="link-arrow">→</span>
            </a>
            <a href="/cookies" className="link-card">
              <div className="link-icon">🍪</div>
              <h3 className="link-title">Politique des Cookies</h3>
              <p className="link-description">
                Informations sur l'utilisation des cookies sur notre site
              </p>
              <span className="link-arrow">→</span>
            </a>
            <a href="/contact" className="link-card">
              <div className="link-icon">📞</div>
              <h3 className="link-title">Contactez-nous</h3>
              <p className="link-description">
                Des questions ? Notre équipe est là pour vous aider
              </p>
              <span className="link-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Acceptance Section */}
      <section className="terms-acceptance">
        <div className="container">
          <div className="acceptance-card">
            <h2 className="acceptance-title">
              Vous avez lu nos conditions générales ?
            </h2>
            <p className="acceptance-text">
              En utilisant TravelHub, vous confirmez avoir lu, compris et accepté ces conditions générales d'utilisation.
            </p>
            <div className="acceptance-buttons">
              <button className="btn-accept">
                J'accepte les conditions
              </button>
              <a href="/" className="btn-back">
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsConditions;