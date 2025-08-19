// import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/utils/constants';

// Layout
import Layout from '../components/common/Layout/Layout';

// Rotas públicas
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Páginas de autenticação
import Login from '../components/auth/Login/Login';
import Register from '../components/auth/Register/Register';
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword';

// Páginas principais
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import HomePage from '../pages/HomePage/HomePage';

// Páginas de gestão
import PessoasPage from '../pages/PessoasPage/PessoasPage';
import ServidoresPage from '../pages/ServidoresPage/ServidoresPage';
import OrganogramaPage from '../pages/OrganogramaPage/OrganogramaPage';
import VisitasPage from '../pages/VisitasPage/VisitasPage';
import HorariosPage from '../pages/HorariosPage/HorariosPage';

// Páginas de erro e utilitárias
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';
import AccountSuspendedPage from '../pages/AccountSuspendedPage/AccountSuspendedPage';

// Páginas de perfil e configurações
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import HelpPage from '../pages/HelpPage/HelpPage';
import NotificationsPage from '../pages/NotificationsPage/NotificationsPage';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Componente para redirecionamento inteligente baseado no papel do usuário
  const SmartRedirect = () => {
    if (user?.papel === ROLES.VISITANTE) {
      return <Navigate to="/visitas" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Rotas públicas (sem autenticação) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      /> 
      
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Páginas de erro (acessíveis sem autenticação) */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/account-suspended" element={<AccountSuspendedPage />} />

      {/* Rotas protegidas com layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Redirecionamento da raiz baseado no papel do usuário */}
        <Route index element={<SmartRedirect />} />
        
        {/* Dashboard - Acessível para ADMIN, RECEPCIONISTA, SERVIDOR */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Home - Acessível para todos os usuários autenticados */}
        <Route
          path="home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Gestão de Pessoas - Apenas ADMIN */}
        <Route
          path="pessoas/*"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
              <PessoasPage />
            </PrivateRoute>
          }
        />

        {/* Gestão de Servidores - ADMIN e RECEPCIONISTA */}
        <Route
          path="servidores/*"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
              <ServidoresPage />
            </PrivateRoute>
          }
        />

        {/* Organograma - Apenas ADMIN */}
        <Route
          path="organograma/*"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
              <OrganogramaPage />
            </PrivateRoute>
          }
        />

        {/* Visitas - ADMIN, RECEPCIONISTA, SERVIDOR, VISITANTE */}
        <Route
          path="visitas/*"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR, ROLES.VISITANTE]}>
              <VisitasPage />
            </PrivateRoute>
          }
        />

        {/* Horários - Apenas ADMIN */}
        <Route
          path="horarios/*"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
              <HorariosPage />
            </PrivateRoute>
          }
        />

        {/* Perfil do usuário - Todos os usuários autenticados */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Configurações - Apenas ADMIN */}
        <Route
          path="settings"
          element={
            <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Notificações - Todos os usuários autenticados */}
        <Route
          path="notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

        {/* Ajuda - Todos os usuários autenticados */}
        <Route
          path="help"
          element={
            <PrivateRoute>
              <HelpPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;