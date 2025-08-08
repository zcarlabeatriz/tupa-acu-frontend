import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import Loading from '../Loading/Loading';
import { useAuth } from '../../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import './Layout.css';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarShow, setMobileSidebarShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Verificar largura da tela para sidebar responsiva
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setSidebarCollapsed(false);
        setMobileSidebarShow(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verificar na inicialização

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fechar sidebar mobile quando navegar
  useEffect(() => {
    setMobileSidebarShow(false);
  }, [window.location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileSidebarShow(!mobileSidebarShow);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarShow(false);
  };

  // Mostrar loading enquanto autentica ou carrega
  if (authLoading || isLoading) {
    return <Loading fullPage text="Carregando sistema..." />;
  }

  return (
    <div className="layout-container">
      {/* Header */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        show={mobileSidebarShow}
        onHide={closeMobileSidebar}
      />

      {/* Conteúdo principal */}
      <main 
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      >
        <div className="content-wrapper">
          <div className="page-content">
            <Outlet />
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </main>

      {/* Overlay para mobile */}
      {mobileSidebarShow && (
        <div 
          className="mobile-overlay" 
          onClick={closeMobileSidebar}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
};

export default Layout;