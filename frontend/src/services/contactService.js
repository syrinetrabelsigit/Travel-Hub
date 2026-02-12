import { apiService } from './api';
import config from '../config/config';

const contactService = {
  // Envoyer un message de contact
  sendMessage: async (messageData) => {
    try {
      const response = await apiService.post('/contact/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Erreur sendMessage:', error);
      throw error;
    }
  }
};

export default contactService;