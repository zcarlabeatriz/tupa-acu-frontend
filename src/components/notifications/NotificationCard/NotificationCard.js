import React from 'react';
import { Card, Badge, Dropdown, Button } from 'react-bootstrap';
import { formatDateTime, formatDate } from '../../../services/utils/formatters';
import { NOTIFICATION_TYPES } from '../../../services/utils/constants';
import './NotificationCard.css';

const NotificationCard = ({ 
  notification, 
  onClick, 
  onMarkAsRead, 
  onDelete, 
  canDelete = false 
}) => {
  const getNotificationIcon = (tipo) => {
    const icons = {
      [NOTIFICATION_TYPES.VISITA_AGENDADA]: 'fas fa-calendar-plus',
      [NOTIFICATION_TYPES.VISITA_APROVADA]: 'fas fa-check-circle',
      [NOTIFICATION_TYPES.VISITA_REJEITADA]: 'fas fa-times-circle',
      [NOTIFICATION_TYPES.VISITA_CANCELADA]: 'fas fa-ban',
      [NOTIFICATION_TYPES.LEMBRETE_VISITA]: 'fas fa-clock',
      [NOTIFICATION_TYPES.SISTEMA]: 'fas fa-cog',
      [NOTIFICATION_TYPES.MANUTENCAO]: 'fas fa-tools',
      [NOTIFICATION_TYPES.ANIVERSARIO]: 'fas fa-birthday-cake',
      [NOTIFICATION_TYPES.REUNIAO]: 'fas fa-users'
    };
    return icons[tipo] || 'fas fa-bell';
  };

  const getNotificationColor = (tipo) => {
    const colors = {
      [NOTIFICATION_TYPES.VISITA_AGENDADA]: '#3b82f6',
      [NOTIFICATION_TYPES.VISITA_APROVADA]: '#10b981',
      [NOTIFICATION_TYPES.VISITA_REJEITADA]: '#ef4444',
      [NOTIFICATION_TYPES.VISITA_CANCELADA]: '#f59e0b',
      [NOTIFICATION_TYPES.LEMBRETE_VISITA]: '#06b6d4',
      [NOTIFICATION_TYPES.SISTEMA]: '#6b7280',
      [NOTIFICATION_TYPES.MANUTENCAO]: '#f59e0b',
      [NOTIFICATION_TYPES.ANIVERSARIO]: '#10b981',
      [NOTIFICATION_TYPES.REUNIAO]: '#3b82f6'
    };
    return colors[tipo] || '#6b7280';
  };

  const getPriorityBadge = (prioridade) => {
    const variants = {
      'baixa': { bg: 'secondary', icon: 'fas fa-arrow-down' },
      'normal': { bg: 'info', icon: 'fas fa-minus' },
      'alta': { bg: 'warning', icon: 'fas fa-arrow-up' },
      'critica': { bg: 'danger', icon: 'fas fa-exclamation' }
    };
    
    const config = variants[prioridade] || variants.normal;
    
    return (
      <Badge bg={config.bg} className="priority-badge">
        <i className={`${config.icon} me-1`}></i>
        {prioridade}
      </Badge>
    );
  };

  const truncateMessage = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const isExpired = () => {
    if (!notification.expirarEm) return false;
    return new Date(notification.expirarEm) < new Date();
  };

  return (
    <Card 
      className={`notification-card ${!notification.lida ? 'unread' : 'read'} ${isExpired() ? 'expired' : ''}`}
    >
      <Card.Body className="p-3">
        <div className="notification-header d-flex align-items-start justify-content-between mb-2">
          <div className="d-flex align-items-center flex-grow-1">
            <div 
              className="notification-icon me-3"
              style={{ color: getNotificationColor(notification.tipo) }}
            >
              <i className={getNotificationIcon(notification.tipo)}></i>
            </div>
            <div className="notification-info flex-grow-1">
              <h6 className="notification-title mb-1">
                {notification.titulo}
                {!notification.lida && <span className="unread-indicator"></span>}
              </h6>
              <div className="notification-meta">
                <small className="text-muted">
                  <i className="fas fa-user me-1"></i>
                  {notification.remetente.nome}
                </small>
                <small className="text-muted ms-3">
                  <i className="fas fa-clock me-1"></i>
                  {formatDateTime(notification.dataEnvio)}
                </small>
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {getPriorityBadge(notification.prioridade)}
            
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                size="sm" 
                className="notification-menu-btn"
                bsPrefix="custom-dropdown-toggle"
              >
                <i className="fas fa-ellipsis-v"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onClick}>
                  <i className="fas fa-eye me-2"></i>
                  Ver Detalhes
                </Dropdown.Item>
                {!notification.lida && onMarkAsRead && (
                  <Dropdown.Item onClick={onMarkAsRead}>
                    <i className="fas fa-check me-2"></i>
                    Marcar como Lida
                  </Dropdown.Item>
                )}
                {canDelete && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger" onClick={onDelete}>
                      <i className="fas fa-trash me-2"></i>
                      Excluir
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="notification-content" onClick={onClick} style={{ cursor: 'pointer' }}>
          <p className="notification-message mb-2">
            {truncateMessage(notification.mensagem)}
          </p>
          
          {notification.dadosAdicionais && (
            <div className="notification-extras">
              {notification.dadosAdicionais.protocolo && (
                <Badge bg="outline-primary" className="me-2">
                  <i className="fas fa-hashtag me-1"></i>
                  {notification.dadosAdicionais.protocolo}
                </Badge>
              )}
              {notification.dadosAdicionais.dataVisita && (
                <Badge bg="outline-info" className="me-2">
                  <i className="fas fa-calendar me-1"></i>
                  {formatDate(notification.dadosAdicionais.dataVisita)}
                </Badge>
              )}
              {notification.dadosAdicionais.horaVisita && (
                <Badge bg="outline-info">
                  <i className="fas fa-clock me-1"></i>
                  {notification.dadosAdicionais.horaVisita}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isExpired() && (
          <div className="notification-footer mt-2">
            <small className="text-danger">
              <i className="fas fa-exclamation-triangle me-1"></i>
              Esta notificação expirou
            </small>
          </div>
        )}

        {notification.emailEnviado && (
          <div className="notification-footer mt-2">
            <small className="text-success">
              <i className="fas fa-envelope me-1"></i>
              Email enviado
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NotificationCard;