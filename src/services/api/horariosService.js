import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const horariosService = {
  listarTodos: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.HORARIOS);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      throw error;
    }
  },
  
  obterPorId: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.HORARIOS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar horário ${id}:`, error);
      throw error;
    }
  },

  buscarPorSetor: async (setorId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.HORARIOS}/setor/${setorId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar horários do setor ${setorId}:`, error);
      throw error;
    }
  },

  criar: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.HORARIOS, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar horário' };
    }
  },

  atualizar: async (id, data) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.HORARIOS}/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar horário' };
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.HORARIOS}/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao deletar horário' };
    }
  }
};