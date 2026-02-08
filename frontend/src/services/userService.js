import { apiService } from './api';
import authService from './authService';
import config from '../config/config';  

/**
 * 🔔 Liste des listeners quand le profil change
 */
const profileUpdateListeners = [];

const userService = {
  // =========================
  // 🔔 EVENTS (OBLIGATOIRE POUR TON FRONT)
  // =========================
  onProfileUpdate: (callback) => {
    profileUpdateListeners.push(callback);

    return () => {
      const index = profileUpdateListeners.indexOf(callback);
      if (index !== -1) {
        profileUpdateListeners.splice(index, 1);
      }
    };
  },

  notifyProfileUpdate: (userData) => {
    profileUpdateListeners.forEach(cb => cb(userData));
  },

  // =========================
  // 📡 API
  // =========================
 getProfile: async () => {
  try {
    const token = authService.getToken();
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await apiService.get(config.API_ENDPOINTS.USER.PROFILE, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur API getProfile:', error);
    throw error.response?.data || error;
  }
},

updateProfile: async (profileData) => {
  try {
    const token = authService.getToken();
    if (!token) throw new Error("Utilisateur non authentifié");

    const { email, ...dataToSend } = profileData;

    const response = await apiService.put('/users/profile', dataToSend, {
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.setItem('USER_DATA', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Erreur API updateProfile:', error);
    throw error.response?.data || error;
  }
}
,


  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token manquant');

      const response = await apiService.post(
        '/users/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response;
    } catch (error) {
      console.error('Erreur API changePassword:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token manquant');

      const response = await apiService.delete('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      window.location.href = '/';
      return response;
    } catch (error) {
      console.error('Erreur API deleteAccount:', error);
      throw error;
    }
  }
};

export default userService;
