import { apiService } from './api';
import config from '../config/config';

const paymentService = {
  // Créer un PaymentIntent
  createPaymentIntent: async (bookingId, amount, currency = 'tnd') => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.PAYMENTS.CREATE_INTENT,
        { bookingId, amount, currency }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Confirmer un paiement
  confirmPayment: async (bookingId, paymentIntentId) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.PAYMENTS.CONFIRM,
        { bookingId, paymentIntentId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Rembourser un paiement
  refundPayment: async (bookingId) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.PAYMENTS.REFUND,
        {},
        { bookingId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default paymentService;