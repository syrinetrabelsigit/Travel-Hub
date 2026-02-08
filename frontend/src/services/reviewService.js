import { apiService } from './api';
import config from '../config/config';

const reviewService = {
  // Obtenir les avis d'un élément
  getReviews: async (itemType, itemId) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.REVIEWS.GET_BY_ITEM,
        { itemType, itemId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir les avis de l'utilisateur
  getUserReviews: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un avis
  createReview: async (reviewData) => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un avis
  updateReview: async (id, reviewData) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.REVIEWS.UPDATE,
        reviewData,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un avis
  deleteReview: async (id) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.REVIEWS.DELETE,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Voter pour un avis
  voteReview: async (id, helpful) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.REVIEWS.VOTE,
        { helpful },
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default reviewService;