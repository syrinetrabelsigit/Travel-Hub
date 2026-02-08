import { apiService } from './api';
import config from '../config/config';

const preferencesService = {
  // Récupérer les préférences
  getPreferences: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.PREFERENCES.GET);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour les préférences
  updatePreferences: async (preferencesData) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.PREFERENCES.UPDATE,
        preferencesData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les voyageurs fréquents
  getFrequentTravelers: async () => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.PREFERENCES.FREQUENT_TRAVELERS
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Ajouter un voyageur fréquent
  addFrequentTraveler: async (travelerData) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.PREFERENCES.ADD_TRAVELER,
        travelerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un voyageur fréquent
  removeFrequentTraveler: async (travelerId) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.PREFERENCES.REMOVE_TRAVELER,
        { id: travelerId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default preferencesService;