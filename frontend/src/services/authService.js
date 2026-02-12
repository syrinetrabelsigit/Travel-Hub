import { apiService } from './api';
import config from '../config/config';

const authService = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Inscription
  register: async (userData) => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.AUTH.REGISTER, userData);
      
      const { token, user } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mot de passe oublié
  forgotPassword: async (email) => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Réinitialiser le mot de passe
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post(config.API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
    window.location.href = '/';
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN);
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: () => {
    const userData = localStorage.getItem(config.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Récupérer le token
  getToken: () => {
    return localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN);
  }
};

// Liste des callbacks à prévenir lors d'un changement d'auth
let listeners = [];

// Permet aux composants de s'abonner aux changements d'utilisateur
authService.onAuthChange = (callback) => {
  listeners.push(callback);

  // Retourne une fonction pour se désabonner
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
};

// Mise à jour de login et logout pour prévenir les listeners
const originalLogin = authService.login;
authService.login = async (email, password) => {
  const result = await originalLogin(email, password);
  const user = result.user;
  listeners.forEach(cb => cb(user)); // Notifie les composants
  return result;
};

const originalLogout = authService.logout;
authService.logout = () => {
  originalLogout();
  listeners.forEach(cb => cb(null)); // Notifie les composants
};

export default authService;