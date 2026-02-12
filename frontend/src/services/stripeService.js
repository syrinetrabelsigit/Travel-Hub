import apiService from './apiService';

const stripeService = {
  // Créer un PaymentIntent
  async createPaymentIntent(paymentData) {
    try {
      console.log('📤 Envoi createPaymentIntent:', paymentData);
      
      const response = await apiService.post('/payments/create-intent', paymentData);
      
      console.log('📥 Réponse createPaymentIntent:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur createPaymentIntent:', error);
      throw error;
    }
  },

  // Confirmer un paiement
  async confirmPayment(bookingId, paymentIntentId) {
    try {
      console.log('📤 Envoi confirmPayment:', { bookingId, paymentIntentId });
      
      const response = await apiService.post('/payments/confirm', {
        bookingId,
        paymentIntentId
      });
      
      console.log('📥 Réponse confirmPayment:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur confirmPayment:', error);
      throw error;
    }
  },

  // Rembourser un paiement
  async refundPayment(bookingId) {
    try {
      const response = await apiService.post(`/payments/refund/${bookingId}`);
      return response;
    } catch (error) {
      console.error('Erreur refundPayment:', error);
      throw error;
    }
  }
};

export default stripeService;