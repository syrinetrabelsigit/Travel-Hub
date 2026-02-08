import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger votre panier');
      // Fallback to empty cart
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (index) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await cartService.removeItem(index);
      await loadCart();
      alert('Article retiré du panier');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Voulez-vous vraiment vider le panier ?')) {
      return;
    }

    try {
      await cartService.clearCart();
      await loadCart();
      alert('Panier vidé');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors du vidage du panier');
    }
  };

  const handleUpdateQuantity = async (index, field, value) => {
    try {
      const item = cart.items[index];
      const updatedItem = { ...item, [field]: Math.max(1, value) };
      await cartService.updateItem(index, updatedItem);
      await loadCart();
    } catch (err) {
      console.error('Erreur:', err);
    }
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

  const calculateItemPrice = (item) => {
    if (item.type === 'flight' && item.passengers) {
      return item.price * item.passengers;
    } else if (item.type === 'hotel' && item.nights && item.rooms) {
      return (item.pricePerNight || item.price) * item.nights * item.rooms;
    } else if (item.type === 'activity' && item.participants) {
      return (item.pricePerPerson || item.price) * item.participants;
    }
    return item.price || 0;
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement de votre panier...</p>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const tax = (subtotal - promoDiscount) * 0.05;
  const total = subtotal - promoDiscount + tax;

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

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image || 'https://via.placeholder.com/400'} alt={item.title || item.name} />
                      <div className="item-type-badge">
                        <span className="type-icon">{getItemIcon(item.type)}</span>
                        <span>{getItemTypeLabel(item.type)}</span>
                      </div>
                    </div>

                    <div className="cart-item-content">
                      <div className="cart-item-header">
                        <h3 className="item-title">{item.title || item.name}</h3>
                        <button 
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(index)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="cart-item-details">
                        {item.type === 'flight' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">🛫</span>
                              <span>{item.airline}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                {item.departure ? new Date(item.departure).toLocaleDateString('fr-FR') : ''} - 
                                {item.departureTime} → {item.arrivalTime}
                              </span>
                            </div>
                          </>
                        )}

                        {item.type === 'hotel' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">📍</span>
                              <span>{item.location}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                Du {item.checkIn ? new Date(item.checkIn).toLocaleDateString('fr-FR') : ''} au{' '}
                                {item.checkOut ? new Date(item.checkOut).toLocaleDateString('fr-FR') : ''}
                              </span>
                            </div>
                          </>
                        )}

                        {item.type === 'activity' && (
                          <>
                            <div className="detail-row">
                              <span className="detail-icon">📍</span>
                              <span>{item.location}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span>
                                {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : ''} à {item.time}
                              </span>
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
                                  onClick={() => handleUpdateQuantity(index, 'passengers', (item.passengers || 1) - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.passengers || 1}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(index, 'passengers', (item.passengers || 1) + 1)}
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
                                  onClick={() => handleUpdateQuantity(index, 'rooms', (item.rooms || 1) - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.rooms || 1}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(index, 'rooms', (item.rooms || 1) + 1)}
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
                                  onClick={() => handleUpdateQuantity(index, 'participants', (item.participants || 1) - 1)}
                                  className="qty-btn"
                                >
                                  -
                                </button>
                                <span className="qty-value">{item.participants || 1}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(index, 'participants', (item.participants || 1) + 1)}
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
                          <span className="price-value">{calculateItemPrice(item).toFixed(2)} DT</span>
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
                    <span>{subtotal.toFixed(2)} DT</span>
                  </div>

                  {appliedPromo && (
                    <div className="price-row discount">
                      <span>Réduction ({appliedPromo.discount}%)</span>
                      <span>-{promoDiscount.toFixed(2)} DT</span>
                    </div>
                  )}

                  <div className="price-row">
                    <span>Taxes (5%)</span>
                    <span>{tax.toFixed(2)} DT</span>
                  </div>

                  <div className="price-row total">
                    <span>Total</span>
                    <span className="total-amount">{total.toFixed(2)} DT</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => navigate('/order-summary')} 
                  className="btn-checkout"
                >
                  <span>Procéder au paiement</span>
                  <span className="arrow-right">→</span>
                </button>

                {/* Clear Cart */}
                <button 
                  onClick={handleClearCart}
                  className="btn-clear-cart"
                >
                  Vider le panier
                </button>

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