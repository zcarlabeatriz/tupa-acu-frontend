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
      console.log('🌐 AuthService: Enviando dados para registro:', userData);
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      console.log('✅ AuthService: Resposta do registro:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ AuthService: Erro no registro:', error);
      console.error('📡 Response data:', error.response?.data);
      
      let errorMessage = 'Erro ao registrar usuário';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          // Erros de validação
          if (data.message) {
            errorMessage = data.message;
          } else if (data.errors) {
            // Se vier um array de erros de validação
            errorMessage = Object.values(data.errors).flat().join(', ');
          }
        } else if (status === 409) {
          // Conflito (usuário já existe)
          errorMessage = data?.message || 'Email ou CPF já cadastrado';
        } else if (status >= 500) {
          errorMessage = 'Erro interno do servidor';
        } else {
          errorMessage = data?.message || `Erro ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      return {
        success: false,
        error: errorMessage
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