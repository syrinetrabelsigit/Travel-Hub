const stripeService = {
  // Créer un PaymentMethod
  async createPaymentMethod(cardData) {
    // Simulation de création de PaymentMethod
    // En production, utilisez Stripe.js pour créer un vrai token
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'pm_' + Math.random().toString(36).substr(2, 9),
          card: {
            last4: cardData.cardNumber.slice(-4),
            brand: 'visa'
          }
        });
      }, 1000);
    });
  },

  // Confirmer un paiement
  async confirmPayment(paymentMethodId, amount) {
    // En production, appelez votre backend qui utilisera Stripe
    const response = await fetch('http://localhost:8080/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId,
        amount,
        currency: 'tnd'
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors du paiement');
    }

    return await response.json();
  }
};

export default stripeService;