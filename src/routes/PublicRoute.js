import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/utils/constants';
import Loading from '../components/common/Loading/Loading';

const PublicRoute = ({ children, redirectIfAuthenticated = true }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading fullPage text="Carregando..." />;
  }

  // Redirecionar usuário autenticado baseado no papel
  if (isAuthenticated && redirectIfAuthenticated) {
    let redirectPath = '/dashboard'; // Padrão para outros papéis
    
    // Se for visitante, redirecionar para visitas
    if (user?.papel === ROLES.VISITANTE) {
      redirectPath = '/visitas';
    }
    
    const from = location.state?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;