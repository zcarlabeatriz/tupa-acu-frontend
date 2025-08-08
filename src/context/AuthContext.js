// File: src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api/axiosConfig';
import { ROLES } from '../services/utils/constants';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Função para decodificar o token JWT
  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (e) {
      console.error('Falha ao decodificar token', e);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          const decodedToken = decodeJwt(token);
          if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            // CORREÇÃO: Padroniza o papel ao inicializar, caso a resposta do backend mude
            const userPapel = decodedToken.papel && decodedToken.papel.length > 0
              ? decodedToken.papel[0].replace('ROLE_', '')
              : null;
            
            const updatedUser = { ...user, papel: userPapel };

            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: updatedUser, token }
            });
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      dispatch({ type: 'LOADING' });

      const response = await api.post('/auth/login', { email, senha });
      const { token, user } = response.data;

      // CORREÇÃO: Agora, esta lógica é mais robusta
      let userData = user;

      if (!userData && token) {
          // Se o backend não retornou o usuário, decodifica do token
          const decodedToken = decodeJwt(token);
          if (decodedToken) {
              const userPapel = decodedToken.papel && decodedToken.papel.length > 0
                  ? decodedToken.papel[0].replace('ROLE_', '')
                  : null;

              userData = {
                  nome: decodedToken.nome, // ou outro campo, se existir
                  email: decodedToken.sub,
                  papel: userPapel,
                  statusConta: decodedToken.statusConta // ou outro campo, se existir
              };
          }
      }
      
      if (!userData) {
          throw new Error('Informações do usuário não encontradas.');
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: userData, token }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      dispatch({ type: 'ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const hasRole = (role) => {
    return state.user?.papel === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.papel);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    hasRole,
    hasAnyRole,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};