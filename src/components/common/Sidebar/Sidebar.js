import React, { useState } from 'react';
import { Nav, Collapse, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { NAVIGATION_ITEMS, ROLES } from '../../../services/utils/constants';
import './Sidebar.css';

const Sidebar = ({ collapsed, show, onHide }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const { user, hasAnyRole } = useAuth();

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredNavigation = NAVIGATION_ITEMS.filter(item => 
    hasAnyRole(item.roles)
  );

  // Submenus específicos para cada seção
  const getSubmenus = (path) => {
    const submenus = {
      '/pessoas': [
        { path: '/pessoas', label: 'Listar Pessoas', icon: 'fas fa-list' },
        { path: '/pessoas/novo', label: 'Nova Pessoa', icon: 'fas fa-plus' }
      ],
      '/servidores': [
        { path: '/servidores', label: 'Listar Servidores', icon: 'fas fa-list' },
        { path: '/servidores/novo', label: 'Novo Servidor', icon: 'fas fa-plus' },
        { path: '/servidores/importar', label: 'Importar SIGEP', icon: 'fas fa-download' }
      ],
      '/organograma': [
        { path: '/organograma', label: 'Visualizar Organograma', icon: 'fas fa-sitemap' },
        { path: '/organograma/setores', label: 'Gerenciar Setores', icon: 'fas fa-building' },
        { path: '/organograma/novo', label: 'Novo Setor', icon: 'fas fa-plus' }
      ],
      '/visitas': [
        { path: '/visitas', label: 'Todas as Visitas', icon: 'fas fa-list' },
        { path: '/visitas/agenda', label: 'Agenda do Dia', icon: 'fas fa-calendar-day' },
        { path: '/visitas/nova', label: 'Agendar Visita', icon: 'fas fa-plus' },
        { path: '/visitas/recepcao', label: 'Controle Recepção', icon: 'fas fa-desktop' }
      ],
      '/horarios': [
        { path: '/horarios', label: 'Horários por Setor', icon: 'fas fa-clock' },
        { path: '/horarios/calendario', label: 'Calendário', icon: 'fas fa-calendar' },
        { path: '/horarios/configurar', label: 'Configurar Horários', icon: 'fas fa-cog' }
      ],
      
    // === NOVO SUBMENU DE NOTIFICAÇÕES ===
    '/notifications': [
      { path: '/notifications', label: 'Todas as Notificações', icon: 'fas fa-list' },
      { path: '/notifications/recebidas', label: 'Recebidas', icon: 'fas fa-inbox' },
      { path: '/notifications/nao-lidas', label: 'Não Lidas', icon: 'fas fa-envelope' },
      ...(hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA]) ? [
        { path: '/notifications/nova', label: 'Nova Notificação', icon: 'fas fa-plus' },
        { path: '/notifications/enviadas', label: 'Enviadas', icon: 'fas fa-paper-plane' }
      ] : [])
    ]
    };
    return submenus[path] || [];
  };

  // Mock de contadores - posteriormente virá da API
  const getItemBadge = (path) => {
    const badges = {
      '/visitas': { count: 5, variant: 'warning', tooltip: '5 visitas pendentes' },
      '/dashboard': { count: 12, variant: 'info', tooltip: '12 notificações' },
      '/notifications': { count: 3, variant: 'danger', tooltip: '3 notificações não lidas' }
    };
    return badges[path];
  };

  const SidebarContent = () => (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header da sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img 
            src="/logo-seduc.png" 
            alt="SEDUC/MA" 
            className="sidebar-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">SISREC</span>
              <span className="brand-subtitle">Sistema de Recepção</span>
            </div>
          )}
        </div>
      </div>

      {/* User info (quando colapsada) */}
      {collapsed && (
        <div className="sidebar-user-collapsed">
          <div className="user-avatar-small">
            {user?.fotoUrl ? (
              <img src={user.fotoUrl} alt={user.nome} />
            ) : (
              <span className="avatar-initials">
                {user?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navegação principal */}
      <Nav className="sidebar-nav">
        {filteredNavigation.map((item, index) => {
          const hasSubmenu = getSubmenus(item.path).length > 0;
          const isActive = isActiveRoute(item.path);
          const isExpanded = expandedMenus[item.path];
          const badge = getItemBadge(item.path);

          return (
            <div key={index} className="nav-item-wrapper">
              <Nav.Item 
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`}
              >
                {hasSubmenu ? (
                  <div
                    className="nav-link-wrapper"
                    onClick={() => !collapsed && toggleSubmenu(item.path)}
                  >
                    <div className="nav-link-content">
                      <i className={item.icon}></i>
                      {!collapsed && (
                        <>
                          <span className="nav-text">{item.label}</span>
                          {badge && (
                            <Badge 
                              bg={badge.variant} 
                              className="nav-badge"
                              title={badge.tooltip}
                            >
                              {badge.count}
                            </Badge>
                          )}
                          <i className={`fas fa-chevron-right submenu-arrow ${isExpanded ? 'expanded' : ''}`}></i>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <Nav.Link 
                    as={Link} 
                    to={item.path}
                    className="nav-link-content"
                    onClick={onHide}
                  >
                    <i className={item.icon}></i>
                    {!collapsed && (
                      <>
                        <span className="nav-text">{item.label}</span>
                        {badge && (
                          <Badge 
                            bg={badge.variant} 
                            className="nav-badge"
                            title={badge.tooltip}
                          >
                            {badge.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Nav.Link>
                )}
              </Nav.Item>

              {/* Submenu */}
              {hasSubmenu && !collapsed && (
                <Collapse in={isExpanded}>
                  <div className="submenu">
                    {getSubmenus(item.path).map((subitem, subIndex) => (
                      <Nav.Item key={subIndex} className="submenu-item">
                        <Nav.Link 
                          as={Link} 
                          to={subitem.path}
                          className={`submenu-link ${isActiveRoute(subitem.path) ? 'active' : ''}`}
                          onClick={onHide}
                        >
                          <i className={subitem.icon}></i>
                          <span className="submenu-text">{subitem.label}</span>
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </div>
                </Collapse>
              )}
            </div>
          );
        })}
      </Nav>

      {/* Rodapé da sidebar */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info-card">
            <div className="user-avatar">
              {user?.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.nome} />
              ) : (
                <span className="avatar-initials">
                  {user?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </span>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.nome}</div>
              <div className="user-role">
                {user?.papel === 'ADMIN' ? 'Administrador' :
                 user?.papel === 'SERVIDOR' ? 'Servidor' :
                 user?.papel === 'RECEPCIONISTA' ? 'Recepcionista' : 'Usuário'}
              </div>
            </div>
          </div>
          <div className="sidebar-version">
            <small>SISREC v1.0.0</small>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <div className="d-lg-none">
        <div className={`mobile-sidebar-overlay ${show ? 'show' : ''}`} onClick={onHide} />
        <div className={`mobile-sidebar ${show ? 'show' : ''}`}>
          <div className="mobile-sidebar-header">
            <button className="mobile-sidebar-close" onClick={onHide}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;