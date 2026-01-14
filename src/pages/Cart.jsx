import React, { useState } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      type: 'flight',
      title: 'Vol Paris - New York',
      airline: 'Air France',
      departure: '2025-02-15',
      departureTime: '10:00',
      arrival: '2025-02-15',
      arrivalTime: '13:00',
      passengers: 2,
      class: 'Economy',
      price: 450,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
    },
    {
      id: 2,
      type: 'hotel',
      title: 'Hôtel Le Grand New York',
      location: 'Manhattan, New York',
      checkIn: '2025-02-15',
      checkOut: '2025-02-20',
      rooms: 1,
      roomType: 'Deluxe Room',
      nights: 5,
      price: 180,
      pricePerNight: 180,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Visite guidée de la Statue de la Liberté',
      location: 'New York, USA',
      date: '2025-02-16',
      time: '14:00',
      duration: '3 heures',
      participants: 2,
      price: 75,
      pricePerPerson: 75,
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculs
  const subtotal = cartItems.reduce((sum, item) => {
    if (item.type === 'flight') {
      return sum + (item.price * item.passengers);
    } else if (item.type === 'hotel') {
      return sum + (item.pricePerNight * item.nights * item.rooms);
    } else if (item.type === 'activity') {
      return sum + (item.pricePerPerson * item.participants);
    }
    return sum;
  }, 0);

  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const tax = (subtotal - promoDiscount) * 0.05; // 5% taxe
  const total = subtotal - promoDiscount + tax;

  const handleRemoveItem = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  const handleUpdateQuantity = (id, field, value) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: Math.max(1, value) };
      }
      return item;
    }));
  };

  const handleApplyPromo = () => {
    const validPromos = {
      'WELCOME10': { discount: 10, name: 'Réduction de 10%' },
      'SUMMER20': { discount: 20, name: 'Réduction de 20%' },
      'VIP30': { discount: 30, name: 'Réduction VIP 30%' }
    };

    if (validPromos[promoCode.toUpperCase()]) {
      setAppliedPromo(validPromos[promoCode.toUpperCase()]);
      alert('Code promo appliqué avec succès !');
    } else {
      alert('Code promo invalide');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'activity': return '🎯';
      default: return '📦';
    }
  };

  const getItemTypeLabel = (type) => {
    switch (type) {
      case 'flight': return 'Vol';
      case 'hotel': return 'Hôtel';
      case 'activity': return 'Activité';
      default: return 'Article';
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">
            <span className="cart-icon">🛒</span>
            Mon Panier
          </h1>
          <p className="cart-subtitle">
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.title} />
                      <div className="item-type-badge">
                        <span className="type-icon">{getItemIcon(item.type)}</span>
                        <span>{getItemTypeLabel(item.type)}</span>
                      </div>
                    </div>

                    <div className="cart-item-content">
                      <div className="cart-item-header">
                        <h3 className="item-title">{item.title}</h3>
                        <button 
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="cart-item-details">
                        {/* Flight Details */}
                        {item.type === 'flight' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">🛫</span>
                              <span>{item.airline}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                {new Date(item.departure).toLocaleDateString('fr-FR')} - 
                                {item.departureTime} → {item.arrivalTime}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">🎫</span>
                              <span>{item.class}</span>
                            </div>
                          </>
                        )}

                        {/* Hotel Details */}
                        {item.type === 'hotel' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">📍</span>
                              <span>{item.location}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                Du {new Date(item.checkIn).toLocaleDateString('fr-FR')} au{' '}
                                {new Date(item.checkOut).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">🛏️</span>
                              <span>{item.roomType} - {item.nights} nuit{item.nights > 1 ? 's' : ''}</span>
                            </div>
                          </>
                        )}

                        {/* Activity Details */}
                        {item.type === 'activity' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">📍</span>
                              <span>{item.location}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                {new Date(item.date).toLocaleDateString('fr-FR')} à {item.time}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">⏱️</span>
                              <span>{item.duration}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="cart-item-footer">
                        <div className="item-quantity">
                          {item.type === 'flight' && (
                            <>
                              <label>Passagers :</label>
                              <div className="quantity-controls">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'passengers', item.passengers - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.passengers}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'passengers', item.passengers + 1)}
                                  className="qty-btn"
                                >
                                  +
                                </button>
                              </div>
                            </>
                          )}

                          {item.type === 'hotel' && (
                            <>
                              <label>Chambres :</label>
                              <div className="quantity-controls">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'rooms', item.rooms - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.rooms}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'rooms', item.rooms + 1)}
                                  className="qty-btn"
                                >
                                  +
                                </button>
                              </div>
                            </>
                          )}

                          {item.type === 'activity' && (
                            <>
                              <label>Participants :</label>
                              <div className="quantity-controls">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'participants', item.participants - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.participants}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.id, 'participants', item.participants + 1)}
                                  className="qty-btn"
                                >
                                  +
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="item-price">
                          <span className="price-label">Prix :</span>
                          <span className="price-value">
                            {item.type === 'flight' && `${item.price * item.passengers}DT`}
                            {item.type === 'hotel' && `${item.pricePerNight * item.nights * item.rooms}DT`}
                            {item.type === 'activity' && `${item.pricePerPerson * item.participants}DT`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="continue-shopping">
                <Link to="/" className="btn-continue">
                  <span className="arrow-left">←</span>
                  Continuer mes achats
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-section">
              <div className="cart-summary">
                <h2 className="summary-title">Récapitulatif</h2>

                {/* Promo Code */}
                <div className="promo-section">
                  <label className="promo-label">Code promo</label>
                  {!appliedPromo ? (
                    <div className="promo-input-group">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Entrez votre code"
                        className="promo-input"
                      />
                      <button 
                        onClick={handleApplyPromo}
                        className="btn-apply-promo"
                        disabled={!promoCode}
                      >
                        Appliquer
                      </button>
                    </div>
                  ) : (
                    <div className="applied-promo">
                      <div className="promo-info">
                        <span className="promo-icon">🎉</span>
                        <span className="promo-name">{appliedPromo.name}</span>
                      </div>
                      <button 
                        onClick={handleRemovePromo}
                        className="btn-remove-promo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}DT</span>
                  </div>

                  {appliedPromo && (
                    <div className="price-row discount">
                      <span>Réduction ({appliedPromo.discount}%)</span>
                      <span>-{promoDiscount.toFixed(2)}DT</span>
                    </div>
                  )}

                  <div className="price-row">
                    <span>Taxes (5%)</span>
                    <span>{tax.toFixed(2)}DT</span>
                  </div>

                  <div className="price-row total">
                    <span>Total</span>
                    <span className="total-amount">{total.toFixed(2)}DT</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/order-summary" className="btn-checkout">
                  <span>Procéder au paiement</span>
                  <span className="arrow-right">→</span>
                </Link>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <span className="badge-icon">🔒</span>
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="trust-badge">
                    <span className="badge-icon">↩️</span>
                    <span>Annulation gratuite</span>
                  </div>
                  <div className="trust-badge">
                    <span className="badge-icon">💳</span>
                    <span>Sans frais cachés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Votre panier est vide</h2>
            <p className="empty-cart-text">
              Découvrez nos destinations et commencez à planifier votre prochain voyage !
            </p>
            <Link to="/" className="btn-explore">
              Explorer les destinations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;