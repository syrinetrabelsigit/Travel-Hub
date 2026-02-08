import { apiService } from './api';
import config from '../config/config';

const searchService = {
  /**
   * Rechercher des vols
   * Utilise AmadeusService en backend avec fallback automatique
   */
  searchFlights: async (searchParams) => {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || null,
        passengers: searchParams.passengers || 1,
        cabinClass: searchParams.cabinClass || 'economy'
      };

      console.log('🔍 Recherche de vols:', params);

      const response = await apiService.post(
        config.API_ENDPOINTS.FLIGHTS.SEARCH,
        params
      );

      console.log('✅ Vols trouvés:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur recherche vols:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtenir les détails d'un vol
   */
  getFlightById: async (flightId) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.FLIGHTS.GET_BY_ID,
        { id: flightId }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur détails vol:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Rechercher des hôtels
   * Utilise AmadeusService en backend avec fallback automatique
   */
  searchHotels: async (searchParams) => {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        destination: searchParams.destination,
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        rooms: searchParams.rooms || 1,
        guests: searchParams.guests || 2,
        minStars: searchParams.minStars || 0
      };

      console.log('🏨 Recherche d\'hôtels:', params);

      const response = await apiService.post(
        config.API_ENDPOINTS.HOTELS.SEARCH,
        params
      );

      console.log('✅ Hôtels trouvés:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur recherche hôtels:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtenir les détails d'un hôtel
   */
  getHotelById: async (hotelId) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.HOTELS.GET_BY_ID,
        { id: hotelId }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur détails hôtel:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Rechercher des activités
   * Utilise FoursquareService en backend avec fallback automatique
   */
  searchActivities: async (searchParams) => {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        destination: searchParams.destination,
        category: searchParams.category || null,
        startDate: searchParams.startDate || null,
        endDate: searchParams.endDate || null,
        minPrice: searchParams.minPrice || null,
        maxPrice: searchParams.maxPrice || null
      };

      console.log('🎯 Recherche d\'activités:', params);

      const response = await apiService.post(
        config.API_ENDPOINTS.ACTIVITIES.SEARCH,
        params
      );

      console.log('✅ Activités trouvées:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur recherche activités:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtenir les détails d'une activité
   */
  getActivityById: async (activityId) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ACTIVITIES.GET_BY_ID,
        { id: activityId }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur détails activité:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Recherche combinée (tous les types)
   */
  searchAll: async (destination, dates) => {
    try {
      const [flights, hotels, activities] = await Promise.allSettled([
        searchService.searchFlights({
          origin: 'TUN',
          destination: destination,
          departureDate: dates.start,
          returnDate: dates.end,
          passengers: 1
        }),
        searchService.searchHotels({
          destination: destination,
          checkInDate: dates.start,
          checkOutDate: dates.end,
          rooms: 1,
          guests: 2
        }),
        searchService.searchActivities({
          destination: destination,
          startDate: dates.start,
          endDate: dates.end
        })
      ]);

      return {
        flights: flights.status === 'fulfilled' ? flights.value : [],
        hotels: hotels.status === 'fulfilled' ? hotels.value : [],
        activities: activities.status === 'fulfilled' ? activities.value : []
      };

    } catch (error) {
      console.error('❌ Erreur recherche combinée:', error);
      throw error;
    }
  }
};

export default searchService;