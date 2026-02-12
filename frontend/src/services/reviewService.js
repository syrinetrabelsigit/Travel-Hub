import apiService from './apiService';

const reviewService = {
  // Récupérer les avis d'un item
  async getReviews(itemType, itemId) {
    try {
      const response = await apiService.get(`/reviews/${itemType}/${itemId}`);
      return response.reviews || [];
    } catch (error) {
      console.error('Erreur getReviews:', error);
      throw error;
    }
  },

  // Récupérer mes avis
  async getMyReviews() {
    try {
      const response = await apiService.get('/reviews/my-reviews');
      return response;
    } catch (error) {
      console.error('Erreur getMyReviews:', error);
      throw error;
    }
  },

  // Créer un avis
  async createReview(reviewData) {
    try {
      const response = await apiService.post('/reviews', reviewData);
      return response;
    } catch (error) {
      console.error('Erreur createReview:', error);
      throw error;
    }
  },

  // Mettre à jour un avis
  async updateReview(reviewId, reviewData) {
    try {
      const response = await apiService.put(`/reviews/${reviewId}`, reviewData);
      return response;
    } catch (error) {
      console.error('Erreur updateReview:', error);
      throw error;
    }
  },

  // Supprimer un avis
  async deleteReview(reviewId) {
    try {
      const response = await apiService.delete(`/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.error('Erreur deleteReview:', error);
      throw error;
    }
  },

  // Voter helpful/not helpful
  async voteHelpful(reviewId, helpful) {
    try {
      const response = await apiService.post(`/reviews/${reviewId}/vote`, { helpful });
      return response;
    } catch (error) {
      console.error('Erreur voteHelpful:', error);
      throw error;
    }
  }
};

export default reviewService;