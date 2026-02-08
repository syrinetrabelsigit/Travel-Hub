import axios from 'axios';
import config from '../config/config';

// Créer une instance Axios
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requêtes (ajouter le token)
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses (gérer les erreurs)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Si erreur 401 (non autorisé), déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
      
      // Rediriger vers la page de connexion seulement si pas déjà sur login/register
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonction helper pour remplacer les paramètres dans les URLs
const replaceUrlParams = (url, params) => {
  let finalUrl = url;
  Object.keys(params).forEach(key => {
    finalUrl = finalUrl.replace(`:${key}`, params[key]);
  });
  return finalUrl;
};

// Export des méthodes HTTP
export const apiService = {
  // GET
  get: (endpoint, params = {}) => {
    const url = replaceUrlParams(endpoint, params);
    return api.get(url);
  },

  // POST
  post: (endpoint, data, params = {}) => {
    const url = replaceUrlParams(endpoint, params);
    return api.post(url, data);
  },

  // PUT
  put: (endpoint, data, params = {}) => {
    const url = replaceUrlParams(endpoint, params);
    return api.put(url, data);
  },

  // PATCH
  patch: (endpoint, data, params = {}) => {
    const url = replaceUrlParams(endpoint, params);
    return api.patch(url, data);
  },

  // DELETE
  delete: (endpoint, params = {}) => {
    const url = replaceUrlParams(endpoint, params);
    return api.delete(url);
  }
};

export default api;