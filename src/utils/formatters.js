// Formater les prix
export const formatPrice = (price, currency = 'DT') => {
  return `${parseFloat(price).toFixed(2)} ${currency}`;
};

// Formater les dates
export const formatDate = (date, locale = 'fr-FR') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date, locale = 'fr-FR') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date, locale = 'fr-FR') => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formater la durée (en minutes)
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins < 10 ? '0' : ''}${mins}`;
};

// Formater les numéros de téléphone
export const formatPhoneNumber = (phone) => {
  // Format: +216 12 345 678
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{3})$/);
  
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return phone;
};

// Formater les numéros de carte de crédit
export const formatCardNumber = (cardNumber) => {
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
};

// Masquer les numéros de carte
export const maskCardNumber = (cardNumber) => {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
};

// Formater les pourcentages
export const formatPercentage = (value, decimals = 0) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// Formater les nombres avec séparateurs de milliers
export const formatNumber = (number, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale).format(number);
};

// Tronquer le texte
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitaliser la première lettre
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Obtenir les initiales
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};