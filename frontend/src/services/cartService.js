import { apiService } from './api';
import config from '../config/config';

const cartService = {
  // Récupérer le panier
  getCart: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.CART.GET);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Ajouter un article au panier
  addItem: async (item) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.CART.ADD_ITEM,
        item
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un article du panier
  updateItem: async (itemId, updateData) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.CART.UPDATE_ITEM,
        updateData,
        { id: itemId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un article du panier
  removeItem: async (itemId) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.CART.REMOVE_ITEM,
        { id: itemId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Vider le panier
  clearCart: async () => {
    try {
      const response = await apiService.delete(config.API_ENDPOINTS.CART.CLEAR);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Appliquer un code promo
  applyPromoCode: async (promoCode) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.CART.APPLY_PROMO,
        { code: promoCode }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default cartService;