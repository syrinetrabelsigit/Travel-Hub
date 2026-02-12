import { apiService } from './api';
import config from '../config/config';

const bookingService = {
  // Créer une réservation (depuis le panier)
  createBooking: async () => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.BOOKINGS.CREATE);
      return response.data;
    } catch (error) {
      console.error('Erreur createBooking:', error);
      throw error;
    }
  },

  // Obtenir toutes les réservations
  getBookings: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.BOOKINGS.LIST);
      return response.data;
    } catch (error) {
      console.error('Erreur getBookings:', error);
      throw error;
    }
  },

  // Obtenir une réservation par ID
  getBooking: async (id) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.BOOKINGS.GET_BY_ID,
        { id }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur getBooking:', error);
      throw error;
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
      console.error('Erreur cancelBooking:', error);
      throw error;
    }
  },

  // Télécharger la facture PDF
  downloadInvoice: async (id) => {
    try {
      const token = localStorage.getItem('travelhub_auth_token');
      const response = await fetch(`http://localhost:8085/api/bookings/${id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur téléchargement facture');
      }

      return await response.blob();
    } catch (error) {
      console.error('Erreur downloadInvoice:', error);
      throw error;
    }
  }
};

export default bookingService;