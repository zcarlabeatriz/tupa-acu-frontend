import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const visitasService = {
  // Listar todas as visitas
  listarTodas: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VISITAS);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar visitas:", error);
      throw error;
    }
  },

  // Buscar visitas por servidor
  buscarPorServidor: async (servidorId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VISITAS}/servidor/${servidorId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar visitas do servidor:", error);
      throw error;
    }
  },

  // Agendar nova visita
  agendar: async (data) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.VISITAS}/agendar`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao agendar visita' };
    }
  },

  // Aprovar visita
  aprovar: async (id) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}/aprovar`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao aprovar visita' };
    }
  },

  // Negar visita
  negar: async (id, motivo) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}/negar`, { motivo });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao negar visita' };
    }
  },

  // Cancelar visita
  cancelar: async (id, motivo) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}/cancelar`, { motivo });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao cancelar visita' };
    }
  },

  // Check-in da visita
  checkIn: async (id) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}/checkin`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao fazer check-in' };
    }
  },

  // Check-out da visita
  checkOut: async (id) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}/checkout`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao fazer check-out' };
    }
  },

  // Obter visita por ID
  obterPorId: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VISITAS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar visita ${id}:`, error);
      throw error;
    }
  },

  // Atualizar visita
  atualizar: async (id, data) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.VISITAS}/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar visita' };
    }
  },

  // Deletar visita
  deletar: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.VISITAS}/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao excluir visita' };
    }
  }
};