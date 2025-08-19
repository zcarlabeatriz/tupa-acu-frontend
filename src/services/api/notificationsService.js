import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const notificationsService = {
  // Buscar todas as notificações do usuário
  listarTodas: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw error;
    }
  },

  // Buscar notificações não lidas
  buscarNaoLidas: async () => {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar notificações não lidas:", error);
      throw error;
    }
  },

  // Contar notificações não lidas
  contarNaoLidas: async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data;
    } catch (error) {
      console.error("Erro ao contar notificações não lidas:", error);
      throw error;
    }
  },

  // Marcar notificação como lida
  marcarComoLida: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao marcar notificação como lida' };
    }
  },

  // Marcar todas como lidas
  marcarTodasComoLidas: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao marcar todas as notificações como lidas' };
    }
  },

  // Criar nova notificação (para admins)
  criar: async (data) => {
    try {
      const response = await api.post('/notifications', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar notificação' };
    }
  },

  // Deletar notificação
  deletar: async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao deletar notificação' };
    }
  }
};