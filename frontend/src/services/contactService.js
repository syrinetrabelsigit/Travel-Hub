import { apiService } from './api';
import config from '../config/config';

const contactService = {
  // Envoyer un message de contact
  sendMessage: async (messageData) => {
    try {
      const response = await apiService.post(
        config.API_ENDPOINTS.CONTACT.SEND_MESSAGE,
        messageData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default contactService;