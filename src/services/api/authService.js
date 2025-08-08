import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  // Login do usuário
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  },

  // Registro de novo usuário
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao registrar usuário'
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao renovar token'
      };
    }
  }
};