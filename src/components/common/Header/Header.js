import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button, Badge, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import './Header.css';

const Header = ({ sidebarCollapsed, toggleSidebar, onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock de notificações - posteriormente virá da API
  const notifications = [
    {
      id: 1,
      title: 'Nova visita agendada',
      message: 'João Silva agendou uma visita para hoje às 14:00',
      time: '2 min atrás',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Visita aguardando aprovação',
      message: 'Maria Santos aguarda aprovação para visita',
      time: '15 min atrás',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Relatório mensal disponível',
      message: 'Relatório de visitas de julho está pronto',
      time: '1 hora atrás',
      read: true,
      type: 'success'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'ADMIN': 'Administrador',
      'SERVIDOR': 'Servidor',
      'RECEPCIONISTA': 'Recepcionista',
      'VISITANTE': 'Visitante'
    };
    return roles[role] || role;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'info': 'fas fa-info-circle text-info',
      'warning': 'fas fa-exclamation-triangle text-warning',
      'success': 'fas fa-check-circle text-success',
      'error': 'fas fa-times-circle text-danger'
    };
    return icons[type] || 'fas fa-bell text-secondary';
  };

  return (
    <>
      <Navbar expand="lg" className="header-navbar fixed-top">
        <div className="navbar-content">
          {/* Botão de menu mobile */}
          <Button
            variant="link"
            className="d-lg-none mobile-menu-btn"
            onClick={onMobileMenuToggle}
          >
            <i className="fas fa-bars"></i>
          </Button>

          {/* Botão de colapsar sidebar (desktop) */}
          <Button
            variant="link"
            className="d-none d-lg-block sidebar-toggle"
            onClick={toggleSidebar}
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
          </Button>

          {/* Logo e título */}
          <div className="header-brand">
            <img 
              src="/logo-seduc.png" 
              alt="SEDUC/MA" 
              className="header-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="header-title">SISREC</span>
          </div>

          {/* Barra de pesquisa (desktop) */}
          <div className="header-search d-none d-md-block">
            <div className="search-input-group">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar visitantes, servidores..."
              />
            </div>
          </div>

          {/* Menu direito */}
          <div className="header-actions">
            {/* Botão de pesquisa mobile */}
            <Button
              variant="link"
              className="d-md-none header-action-btn"
            >
              <i className="fas fa-search"></i>
            </Button>

            {/* Notificações */}
            <div className="notification-wrapper">
              <Button
                variant="link"
                className="header-action-btn position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <Badge 
                    bg="danger" 
                    className="notification-badge position-absolute"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h6 className="mb-0">Notificações</h6>
                    <Button variant="link" size="sm">
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <div className="notifications-body">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        >
                          <div className="notification-icon">
                            <i className={getNotificationIcon(notification.type)}></i>
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title}
                            </div>
                            <div className="notification-message">
                              {notification.message}
                            </div>
                            <div className="notification-time">
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                  <div className="notifications-footer">
                    <Link to="/notifications" className="btn btn-sm btn-outline-primary w-100">
                      Ver todas as notificações
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do usuário */}
            <NavDropdown
              title={
                <div className="user-profile-trigger">
                  <div className="user-avatar">
                    {user?.fotoUrl ? (
                      <img src={user.fotoUrl} alt={user.nome} />
                    ) : (
                      <span className="avatar-initials">
                        {getInitials(user?.nome || 'User')}
                      </span>
                    )}
                  </div>
                  <div className="user-info d-none d-sm-block">
                    <span className="user-name">{user?.nome}</span>
                    <span className="user-role">{getRoleDisplay(user?.papel)}</span>
                  </div>
                </div>
              }
              id="user-dropdown"
              className="user-dropdown"
              align="end"
            >
              <div className="dropdown-user-info">
                <div className="user-avatar-large">
                  {user?.fotoUrl ? (
                    <img src={user.fotoUrl} alt={user.nome} />
                  ) : (
                    <span className="avatar-initials">
                      {getInitials(user?.nome || 'User')}
                    </span>
                  )}
                </div>
                <div className="user-details">
                  <strong>{user?.nome}</strong>
                  <div className="text-muted">{user?.email}</div>
                  <Badge bg="secondary" className="mt-1">
                    {getRoleDisplay(user?.papel)}
                  </Badge>
                </div>
              </div>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/profile">
                <i className="fas fa-user me-2"></i>
                Meu Perfil
              </NavDropdown.Item>
              
              <NavDropdown.Item as={Link} to="/settings">
                <i className="fas fa-cog me-2"></i>
                Configurações
              </NavDropdown.Item>
              
              <NavDropdown.Item as={Link} to="/help">
                <i className="fas fa-question-circle me-2"></i>
                Ajuda
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Sair
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </div>
      </Navbar>

      {/* Overlay para fechar dropdowns */}
      {showNotifications && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Header;