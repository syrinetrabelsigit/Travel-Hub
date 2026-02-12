import apiService from './apiService';

const searchService = {
  /**
   * Rechercher des vols
   */
  async searchFlights(searchParams) {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        origin: searchParams.from || searchParams.origin,
        destination: searchParams.to || searchParams.destination,
        departureDate: searchParams.departDate || searchParams.departureDate,
        returnDate: searchParams.returnDate || null,
        passengers: parseInt(searchParams.passengers) || 1,
        cabinClass: searchParams.class || searchParams.cabinClass || 'economy'
      };

      console.log('🔍 Recherche de vols:', params);

      const response = await apiService.post('/search/flights', params);

      console.log('✅ Vols trouvés:', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur recherche vols:', error);
      throw error;
    }
  },

  /**
   * Obtenir les détails d'un vol par ID
   */
  async getFlightDetails(flightId) {
    try {
      const response = await apiService.get(`/search/flight/${flightId}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur détails vol:', error);
      throw error;
    }
  },

  /**
   * Rechercher des hôtels
   */
  async searchHotels(searchParams) {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        destination: searchParams.destination,
        checkInDate: searchParams.checkIn || searchParams.checkInDate,
        checkOutDate: searchParams.checkOut || searchParams.checkOutDate,
        rooms: parseInt(searchParams.rooms) || 1,
        guests: parseInt(searchParams.guests) || 2,
        minStars: parseInt(searchParams.minStars) || 0
      };

      console.log('🏨 Recherche d\'hôtels:', params);

      const response = await apiService.post('/search/hotels', params);

      console.log('✅ Hôtels trouvés:', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur recherche hôtels:', error);
      throw error;
    }
  },

  /**
   * Obtenir les détails d'un hôtel par ID
   */
  async getHotelDetails(hotelId) {
    try {
      const response = await apiService.get(`/search/hotel/${hotelId}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur détails hôtel:', error);
      throw error;
    }
  },

  /**
   * Rechercher des activités
   */
  async searchActivities(searchParams) {
    try {
      // Adapter les paramètres au format attendu par le backend
      const params = {
        destination: searchParams.destination,
        date: searchParams.date,
        category: searchParams.category !== 'all' ? searchParams.category : null,
        maxPrice: parseFloat(searchParams.maxPrice) || null
      };

      console.log('🎯 Recherche d\'activités:', params);

      const response = await apiService.post('/search/activities', params);

      console.log('✅ Activités trouvées:', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur recherche activités:', error);
      throw error;
    }
  },

  /**
   * Obtenir les détails d'une activité par ID
   */
  async getActivityDetails(activityId) {
    try {
      const response = await apiService.get(`/search/activity/${activityId}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur détails activité:', error);
      throw error;
    }
  },

  /**
   * Recherche combinée (tous les types)
   */
  async searchAll(destination, dates) {
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
          date: dates.start
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