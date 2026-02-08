// Configuration de l'application
const config = {
  // URL de l'API Backend (Spring Boot)
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // Endpoints API
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password'
    },
    BOOKINGS: {
      LIST: '/bookings',
      GET_BY_ID: '/bookings/:id',
      CREATE: '/bookings',
      CANCEL: '/bookings/:id/cancel',
      DOWNLOAD_INVOICE: '/bookings/:id/invoice'
    },
    PREFERENCES: {
      GET: '/users/preferences',
      UPDATE: '/users/preferences',
      FREQUENT_TRAVELERS: '/users/preferences/frequent-travelers',
      REMOVE_TRAVELER: '/users/preferences/frequent-travelers/:index'
    },
    CART: {
      GET: '/cart',
      ADD_ITEM: '/cart/items',
      UPDATE_ITEM: '/cart/items/:index',
      REMOVE_ITEM: '/cart/items/:index',
      CLEAR: '/cart'
    },
    FLIGHTS: {
      SEARCH: '/search/flights',
      GET_BY_ID: '/search/flight/:id'
    },
    
    HOTELS: {
      SEARCH: '/search/hotels',
      GET_BY_ID: '/search/hotel/:id'
    },
    
    ACTIVITIES: {
      SEARCH: '/search/activities',
      GET_BY_ID: '/search/activity/:id'
    },
    SEARCH: {
      FLIGHTS: '/search/flights',
      HOTELS: '/search/hotels',
      ACTIVITIES: '/search/activities',
      FLIGHT_DETAILS: '/search/flight/:id',
      HOTEL_DETAILS: '/search/hotel/:id',
      ACTIVITY_DETAILS: '/search/activity/:id'
    },
    REVIEWS: {
      LIST: '/reviews/:itemType/:itemId',
      GET_BY_ITEM: '/reviews/:itemType/:itemId',
      MY_REVIEWS: '/reviews/my-reviews',
      GET_USER_REVIEWS: '/reviews/my-reviews',
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      DELETE: '/reviews/:id',
      VOTE: '/reviews/:id/vote'
    },
    PAYMENTS: {
      CREATE_INTENT: '/payments/create-intent',
      CONFIRM: '/payments/confirm',
      REFUND: '/payments/refund/:bookingId'
    },
    
    CURRENCY: {
      SUPPORTED: '/currency/supported',
      CONVERT: '/currency/convert'
    },
    // Admin
    ADMIN: {
      STATS: '/admin/stats',
      USERS: '/admin/users',
      USER_BY_ID: '/admin/users/:id',
      UPDATE_USER: '/admin/users/:id',
      DELETE_USER: '/admin/users/:id',
      UPDATE_ROLE: '/admin/users/:id/role',
      BOOKINGS: '/admin/bookings',
      BOOKING_BY_ID: '/admin/bookings/:id',
      UPDATE_BOOKING_STATUS: '/admin/bookings/:id/status',
      DELETE_BOOKING: '/admin/bookings/:id',
      REVIEWS: '/admin/reviews',
      REVIEW_BY_ID: '/admin/reviews/:id',
      APPROVE_REVIEW: '/admin/reviews/:id/approve',
      REJECT_REVIEW: '/admin/reviews/:id/reject',
      DELETE_REVIEW: '/admin/reviews/:id',
      ADMIN_PROFILE: '/profileAdmin'

    },
  },

  // Timeout pour les requêtes API (en millisecondes)
  API_TIMEOUT: 30000,
  
  // Clés de stockage local
  STORAGE_KEYS: {
    AUTH_TOKEN: 'travelhub_auth_token',
    USER_DATA: 'travelhub_user_data'
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  
  // Langue par défaut
  DEFAULT_LANGUAGE: 'fr',
  
  // Devise par défaut
  DEFAULT_CURRENCY: 'EUR'
};

export default config;