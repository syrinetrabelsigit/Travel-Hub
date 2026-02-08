import { apiService } from './api';
import config from '../config/config';

const bookingService = {
  // Récupérer toutes les réservations
  getBookings: async (filters = {}) => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.BOOKINGS.LIST, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer une réservation par ID
  getBookingById: async (id) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.BOOKINGS.GET_BY_ID,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer une réservation
  createBooking: async (bookingData) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.BOOKINGS.CREATE,
        bookingData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Annuler une réservation
  cancelBooking: async (id) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.BOOKINGS.CANCEL,
        {},
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Modifier une réservation
  updateBooking: async (id, updateData) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.BOOKINGS.UPDATE,
        updateData,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default bookingService;