import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading/Loading';

const PublicRoute = ({ children, redirectIfAuthenticated = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading fullPage text="Carregando..." />;
  }

  // Redirecionar usuário autenticado para dashboard
  if (isAuthenticated && redirectIfAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;