import apiService from './apiService';

const reviewService = {
  // Obtenir les avis d'un élément
  async getReviews(itemType, itemId) {
    return await apiService.get(`/reviews/${itemType}/${itemId}`);
  },

  // Créer un avis
  async createReview(reviewData) {
    return await apiService.post('/reviews', reviewData);
  },

  // Mettre à jour un avis
  async updateReview(id, reviewData) {
    return await apiService.put(`/reviews/${id}`, reviewData);
  },

  // Supprimer un avis
  async deleteReview(id) {
    return await apiService.delete(`/reviews/${id}`);
  }
};

export default reviewService;