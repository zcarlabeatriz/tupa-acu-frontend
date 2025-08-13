import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const organogramaService = {
  listarTodos: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORGANOGRAMA);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar organograma:", error);
      throw error;
    }
  },
  
  obterPorId: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ORGANOGRAMA}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar setor ${id}:`, error);
      throw error;
    }
  },

  criarSetor: async (data) => {
    try {
      // Garantir que setorPaiId seja null quando não for selecionado
      const dadosNovos = {
        ...data,
        setorPaiId: data.setorPaiId === '' ? null : data.setorPaiId
      };
      
      const response = await api.post(API_ENDPOINTS.ORGANOGRAMA, dadosNovos);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar setor' };
    }
  },

  atualizarSetor: async (id, data) => {
    try {
      // Garantir que setorPaiId seja null quando não for selecionado
      const dadosAtualizados = {
        ...data,
        setorPaiId: data.setorPaiId === '' ? null : data.setorPaiId
      };
      
      const response = await api.put(`${API_ENDPOINTS.ORGANOGRAMA}/${id}`, dadosAtualizados);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar setor' };
    }
  },

  deletarSetor: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.ORGANOGRAMA}/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao excluir setor' };
    }
  },

  alterarStatus: async (id, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.ORGANOGRAMA}/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao alterar status do setor' };
    }
  }
};