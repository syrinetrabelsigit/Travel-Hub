import apiService from './apiService';

const bookingService = {
  // Créer une réservation
  async createBooking(bookingData) {
    return await apiService.post('/bookings', bookingData);
  },

  // Obtenir une réservation
  async getBooking(id) {
    return await apiService.get(`/bookings/${id}`);
  },

  // Obtenir toutes les réservations de l'utilisateur
  async getUserBookings() {
    return await apiService.get('/bookings/user');
  },

  // Annuler une réservation
  async cancelBooking(id) {
    return await apiService.delete(`/bookings/${id}`);
  },

  // Mettre à jour une réservation
  async updateBooking(id, data) {
    return await apiService.put(`/bookings/${id}`, data);
  }
};

export default bookingService;