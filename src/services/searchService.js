import apiService from './apiService';

const searchService = {
  // Rechercher des vols
  async searchFlights(params) {
    const queryString = new URLSearchParams(params).toString();
    return await apiService.get(`/search/flights?${queryString}`);
  },

  // Rechercher des hôtels
  async searchHotels(params) {
    const queryString = new URLSearchParams(params).toString();
    return await apiService.get(`/search/hotels?${queryString}`);
  },

  // Rechercher des activités
  async searchActivities(params) {
    const queryString = new URLSearchParams(params).toString();
    return await apiService.get(`/search/activities?${queryString}`);
  },

  // Obtenir les détails d'un vol
  async getFlightDetails(id) {
    return await apiService.get(`/flights/${id}`);
  },

  // Obtenir les détails d'un hôtel
  async getHotelDetails(id) {
    return await apiService.get(`/hotels/${id}`);
  },

  // Obtenir les détails d'une activité
  async getActivityDetails(id) {
    return await apiService.get(`/activities/${id}`);
  }
};

export default searchService;