import React, { useState, useEffect } from 'react';
import cartService from '../services/cartService';
import './Cart.css';
import { Link } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger le panier au démarrage
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculs
  const subtotal = cart?.totalPrice || 0;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const tax = (subtotal - promoDiscount) * 0.05; // 5% taxe
  const total = subtotal - promoDiscount + tax;

  const handleRemoveItem = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await cartService.removeItem(index);
        await fetchCart(); // Refresh
        alert('Article supprimé avec succès !');
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const handleUpdateQuantity = async (index, newQuantity) => {
    try {
      const item = cart.items[index];
      
      const updatedItem = {
        type: item.type,
        itemId: item.itemId,
        data: item.data,
        price: item.price,
        quantity: newQuantity 
      };
      
      const updatedCart = await cartService.updateItem(index, updatedItem);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      try {
        await cartService.clearCart();
        await fetchCart(); // Refresh
        alert('Panier vidé avec succès !');
      } catch (error) {
        console.error('Erreur vidage panier:', error);
        alert('Erreur lors du vidage du panier: ' + error.message);
      }
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

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement du panier...</p>
          </div>
        </div>
      </div>
    );
  }

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
          {cartItems.length > 0 && (
            <button onClick={handleClearCart} className="btn-clear-cart">
              Vider le panier
            </button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-image">
                      <div className="item-placeholder">
                        <span className="placeholder-icon">{getItemIcon(item.type)}</span>
                      </div>
                      <div className="item-type-badge">
                        <span className="type-icon">{getItemIcon(item.type)}</span>
                        <span>{getItemTypeLabel(item.type)}</span>
                      </div>
                    </div>

                    <div className="cart-item-content">
                      <div className="cart-item-header">
                        <h3 className="item-title">
                          {item.type === 'flight' && 'Vol'}
                          {item.type === 'hotel' && 'Hôtel'}
                          {item.type === 'activity' && 'Activité'}
                          {' - ID: ' + item.itemId}
                        </h3>
                        <button
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(index)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="cart-item-details">
                        <div className="detail-row">
                          <span className="detail-icon">📦</span>
                          <span>Référence: {item.itemId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-icon">📅</span>
                          <span>Ajouté le: {new Date(item.addedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="cart-item-footer">
                        <div className="item-price">
                          <span className="price-label">Prix :</span>
                          <span className="price-value">
                            {(item.price * item.quantity).toFixed(2)} {cart.currency}
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
                    <span>{subtotal.toFixed(2)} {cart.currency}</span>
                  </div>

                  {appliedPromo && (
                    <div className="price-row discount">
                      <span>Réduction ({appliedPromo.discount}%)</span>
                      <span>-{promoDiscount.toFixed(2)} {cart.currency}</span>
                    </div>
                  )}

                  <div className="price-row">
                    <span>Taxes (5%)</span>
                    <span>{tax.toFixed(2)} {cart.currency}</span>
                  </div>

                  <div className="price-row total">
                    <span>Total</span>
                    <span className="total-amount">{total.toFixed(2)} {cart.currency}</span>
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