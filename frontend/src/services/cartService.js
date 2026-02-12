import apiService from './apiService';

const cartService = {
  // Obtenir le panier
  async getCart() {
    try {
      const response = await apiService.get('/cart');
      return response;
    } catch (error) {
      console.error('Erreur getCart:', error);
      return {
        items: [],
        totalPrice: 0,
        currency: 'EUR'
      };
    }
  },

  // Ajouter un article au panier
  async addItem(item) {
    try {
      const response = await apiService.post('/cart/items', item);
      return response;
    } catch (error) {
      console.error('Erreur addItem:', error);
      throw error;
    }
  },

  // Mettre à jour un article (par index)
  async updateItem(index, item) {
    try {
      const response = await apiService.put(`/cart/items/${index}`, item);
      return response;
    } catch (error) {
      console.error('Erreur updateItem:', error);
      throw error;
    }
  },

  // Supprimer un article (par index)
  async removeItem(index) {
    try {
      const response = await apiService.delete(`/cart/items/${index}`);
      return response;
    } catch (error) {
      console.error('Erreur removeItem:', error);
      throw error;
    }
  },

  // Vider le panier
  async clearCart() {
    try {
      const response = await apiService.delete('/cart');
      return response;
    } catch (error) {
      console.error('Erreur clearCart:', error);
      throw error;
    }
  }
};

export default cartService;