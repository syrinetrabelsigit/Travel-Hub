import apiService from './apiService';

const bookingService = {
  // Créer une réservation (depuis le panier)
  async createBooking() {
    try {
      const response = await apiService.post('/bookings');
      return response;
    } catch (error) {
      console.error('Erreur createBooking:', error);
      throw error;
    }
  },

  // Obtenir une réservation par ID
  async getBooking(id) {
    try {
      const response = await apiService.get(`/bookings/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur getBooking:', error);
      throw error;
    }
  },

  // Obtenir toutes les réservations de l'utilisateur
  async getUserBookings() {
    try {
      const response = await apiService.get('/bookings');
      return response;
    } catch (error) {
      console.error('Erreur getUserBookings:', error);
      throw error;
    }
  },

  // Annuler une réservation
  async cancelBooking(id) {
    try {
      const response = await apiService.put(`/bookings/${id}/cancel`);
      return response;
    } catch (error) {
      console.error('Erreur cancelBooking:', error);
      throw error;
    }
  },

  // Télécharger la facture PDF
  async downloadInvoice(id) {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'}/bookings/${id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de la facture');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur downloadInvoice:', error);
      throw error;
    }
  }
};

export default bookingService;