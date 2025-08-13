import api from './axiosConfig';
import { API_ENDPOINTS, ROLES } from '../utils/constants';

export const pessoasService = {
  getTodasPessoas: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PESSOAS, {
        params:{papel: ROLES.VISITANTE} // Filtrar apenas visitantes
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      throw error;
    }
  },

  criarPessoa: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.PESSOAS, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar pessoa' };
    }
  },

  atualizarPessoa: async (id, data) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.PESSOAS}/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar pessoa' };
    }
  },

  deletarPessoa: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.PESSOAS}/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao excluir pessoa' };
    }
  },

  getPessoaLogada: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PESSOAS}/me`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar dados do usuário' };
    }
  },
};