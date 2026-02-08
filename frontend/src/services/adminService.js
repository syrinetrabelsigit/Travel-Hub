import { apiService } from './api';
import config from '../config/config';

const adminService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.ADMIN.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== GESTION UTILISATEURS ====================
  getAllUsers: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.ADMIN.USERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ADMIN.USER_BY_ID,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.ADMIN.UPDATE_USER,
        userData,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.ADMIN.DELETE_USER,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.ADMIN.UPDATE_ROLE,
        { role },
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== GESTION RÉSERVATIONS ====================
  getAllBookings: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.ADMIN.BOOKINGS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ADMIN.BOOKING_BY_ID,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.ADMIN.UPDATE_BOOKING_STATUS,
        { status },
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteBooking: async (id) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.ADMIN.DELETE_BOOKING,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== GESTION AVIS ====================
  getAllReviews: async () => {
    try {
      const response = await apiService.get(config.API_ENDPOINTS.ADMIN.REVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getReviewById: async (id) => {
    try {
      const response = await apiService.get(
        config.API_ENDPOINTS.ADMIN.REVIEW_BY_ID,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveReview: async (id) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.ADMIN.APPROVE_REVIEW,
        {},
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectReview: async (id) => {
    try {
      const response = await apiService.put(
        config.API_ENDPOINTS.ADMIN.REJECT_REVIEW,
        {},
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await apiService.delete(
        config.API_ENDPOINTS.ADMIN.DELETE_REVIEW,
        { id }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminService;