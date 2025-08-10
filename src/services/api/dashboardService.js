import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  }
};