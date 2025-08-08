import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading/Loading';

const PrivateRoute = ({ children, requiredRoles = [], allowedStatuses = ['ATIVO'] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading fullPage text="Verificando permissões..." />;
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: 'Você precisa fazer login para acessar esta página.' }}
        replace 
      />
    );
  }

  // Verificar se a conta está ativa
  if (!allowedStatuses.includes(user?.statusConta)) {
    return (
      <Navigate 
        to="/account-suspended" 
        state={{ 
          reason: user?.statusConta,
          message: 'Sua conta não está ativa. Entre em contato com o administrador.' 
        }}
        replace 
      />
    );
  }

  // Verificar permissões por papel (role)
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.papel)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          requiredRoles,
          userRole: user?.papel,
          message: 'Você não tem permissão para acessar esta página.' 
        }}
        replace 
      />
    );
  }

  return children;
};

export default PrivateRoute;