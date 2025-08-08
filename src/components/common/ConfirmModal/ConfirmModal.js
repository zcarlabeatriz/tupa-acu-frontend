import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './ConfirmModal.css';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  variant = 'danger',
  confirmText,
  cancelText = 'Cancelar',
  size = 'md',
  centered = true,
  isLoading = false,
  icon,
  children
}) => {
  // Configurações por variante
  const variantConfig = {
    danger: {
      icon: icon || 'fas fa-exclamation-triangle',
      iconColor: '#dc3545',
      confirmText: confirmText || 'Excluir',
      confirmVariant: 'danger'
    },
    warning: {
      icon: icon || 'fas fa-exclamation-circle',
      iconColor: '#ffc107',
      confirmText: confirmText || 'Confirmar',
      confirmVariant: 'warning'
    },
    info: {
      icon: icon || 'fas fa-info-circle',
      iconColor: '#17a2b8',
      confirmText: confirmText || 'Confirmar',
      confirmVariant: 'info'
    },
    success: {
      icon: icon || 'fas fa-check-circle',
      iconColor: '#28a745',
      confirmText: confirmText || 'Confirmar',
      confirmVariant: 'success'
    },
    primary: {
      icon: icon || 'fas fa-question-circle',
      iconColor: '#007bff',
      confirmText: confirmText || 'Confirmar',
      confirmVariant: 'primary'
    }
  };

  const config = variantConfig[variant] || variantConfig.danger;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading && onHide) {
      onHide();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleCancel}
      size={size}
      centered={centered}
      backdrop={isLoading ? 'static' : true}
      keyboard={!isLoading}
      className="confirm-modal"
    >
      <Modal.Header closeButton={!isLoading} className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex align-items-center justify-content-center">
            <div 
              className="confirm-icon-wrapper me-3"
              style={{ color: config.iconColor }}
            >
              <i className={config.icon}></i>
            </div>
            <span>{title}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center px-4 py-3">
        {message && (
          <p className="confirm-message mb-0">
            {message}
          </p>
        )}
        {children && (
          <div className="confirm-content mt-3">
            {children}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={isLoading}
          className="me-2"
        >
          {cancelText}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading}
          className="confirm-button"
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processando...
            </>
          ) : (
            <>
              <i className={`fas fa-${variant === 'danger' ? 'trash' : 'check'} me-2`}></i>
              {config.confirmText}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info', 'success', 'primary']),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  centered: PropTypes.bool,
  isLoading: PropTypes.bool,
  icon: PropTypes.string,
  children: PropTypes.node
};

export default ConfirmModal;