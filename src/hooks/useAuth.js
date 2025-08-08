import { useContext } from 'react';
import { AuthProvider } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthProvider);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};