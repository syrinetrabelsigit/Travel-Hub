import { apiService } from './api';
import config from '../config/config';

const orderService = {
  // Créer une commande
  createOrder: async (orderData) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.ORDERS.CREATE,
        orderData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ORDERS.GET_BY_ID,
        { id: orderId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer toutes les commandes
  getOrders: async (filters = {}) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ORDERS.LIST,
        { params: filters }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Effectuer le paiement
  processPayment: async (orderId, paymentData) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.ORDERS.PAYMENT,
        paymentData,
        { id: orderId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default orderService;