import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const servidoresService = {
  getTodosServidores: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SERVIDORES);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar servidores:", error);
      throw error;
    }
  },
  
  getTodosSetores: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SERVIDORES}/setores`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      throw error;
    }
  },

  getServidoresPorSetor: async (setorId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SERVIDORES}/setor/${setorId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar servidores do setor:", error);
      throw error;
    }
  },

  criarServidor: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.SERVIDORES, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar servidor' };
    }
  },

  atualizarServidor: async (id, data) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.SERVIDORES}/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar servidor' };
    }
  },

  deletarServidor: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.SERVIDORES}/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao excluir servidor' };
    }
  },
};