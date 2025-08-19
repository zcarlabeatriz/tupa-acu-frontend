// File: src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api/axiosConfig';

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
            
            // CORREÇÃO: Lê o papel como uma string diretamente do token decodificado.
            const userPapel = decodedToken.papel;
            
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

    if (!token) {
      throw new Error('Token não recebido do servidor');
    }

    // Salvar no localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Atualizar estado
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token }
    });
    
    return { success: true };
  } catch (error) {
    
    
    let errorMessage = 'Erro ao fazer login';
    
    if (error.response) {
      
      
      const { status, data } = error.response;
      
      if (status === 401) {
        errorMessage = data?.message || 'Email ou senha incorretos';
      } else if (status === 400) {
        errorMessage = data?.message || 'Dados inválidos';
      } else if (status >= 500) {
        errorMessage = 'Erro interno do servidor';
      } else {
        errorMessage = data?.message || `Erro ${status}`;
      }
    } else if (error.request) {
      
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else {
      
      errorMessage = error.message;
    }
    
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