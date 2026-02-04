// URLs de l'API
export const API_URLS = {
  BASE: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  AUTH: '/auth',
  SEARCH: '/search',
  BOOKINGS: '/bookings',
  REVIEWS: '/reviews',
  PAYMENTS: '/payments'
};

// Classes de vol
export const FLIGHT_CLASSES = {
  ECONOMY: 'economy',
  PREMIUM: 'premium',
  BUSINESS: 'business',
  FIRST: 'first'
};

export const FLIGHT_CLASS_LABELS = {
  [FLIGHT_CLASSES.ECONOMY]: 'Économique',
  [FLIGHT_CLASSES.PREMIUM]: 'Premium',
  [FLIGHT_CLASSES.BUSINESS]: 'Affaires',
  [FLIGHT_CLASSES.FIRST]: 'Première classe'
};

// Statuts de réservation
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'En attente',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmé',
  [BOOKING_STATUS.CANCELLED]: 'Annulé',
  [BOOKING_STATUS.COMPLETED]: 'Terminé'
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CARD]: 'Carte bancaire',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Virement bancaire'
};

// Catégories d'activités
export const ACTIVITY_CATEGORIES = {
  ALL: 'all',
  CULTURE: 'culture',
  ADVENTURE: 'adventure',
  FOOD: 'food',
  NATURE: 'nature',
  ENTERTAINMENT: 'entertainment'
};

export const ACTIVITY_CATEGORY_LABELS = {
  [ACTIVITY_CATEGORIES.ALL]: 'Toutes',
  [ACTIVITY_CATEGORIES.CULTURE]: 'Culture & Patrimoine',
  [ACTIVITY_CATEGORIES.ADVENTURE]: 'Aventure',
  [ACTIVITY_CATEGORIES.FOOD]: 'Gastronomie',
  [ACTIVITY_CATEGORIES.NATURE]: 'Nature',
  [ACTIVITY_CATEGORIES.ENTERTAINMENT]: 'Divertissement'
};

// Pays
export const COUNTRIES = [
  { code: 'TN', name: 'Tunisie' },
  { code: 'FR', name: 'France' },
  { code: 'MA', name: 'Maroc' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'US', name: 'États-Unis' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'AE', name: 'Émirats Arabes Unis' },
  { code: 'SA', name: 'Arabie Saoudite' }
];

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos informations.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite.'
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{8,}$/,
  POSTAL_CODE: /^\d{4,}$/,
  CARD_NUMBER: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
  EXPIRY_DATE: /^\d{2}\/\d{2}$/
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Tri
export const SORT_OPTIONS = {
  RECOMMENDED: 'recommended',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING: 'rating',
  DURATION: 'duration',
  RECENT: 'recent'
};

export const SORT_LABELS = {
  [SORT_OPTIONS.RECOMMENDED]: 'Recommandé',
  [SORT_OPTIONS.PRICE_ASC]: 'Prix croissant',
  [SORT_OPTIONS.PRICE_DESC]: 'Prix décroissant',
  [SORT_OPTIONS.RATING]: 'Meilleure note',
  [SORT_OPTIONS.DURATION]: 'Durée',
  [SORT_OPTIONS.RECENT]: 'Plus récents'
};

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  SEARCH_HISTORY: 'searchHistory',
  PREFERENCES: 'userPreferences'
};

// Couleurs CSS (pour utilisation dans le code JS si nécessaire)
export const COLORS = {
  PRIMARY: '#1E40AF',
  PRIMARY_LIGHT: '#3B82F6',
  PRIMARY_DARK: '#1E3A8A',
  SECONDARY: '#10B981',
  SUCCESS: '#4CAF50',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6',
  NEUTRAL: '#6B7280',
  BG_LIGHT: '#F9FAFB',
  BG_WHITE: '#FFFFFF'
};