import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AccountSuspendedPage.css';

const AccountSuspendedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const { reason, message } = location.state || {};

  const getStatusMessage = (status) => {
    const messages = {
      'INATIVA': {
        title: 'Conta Inativa',
        description: 'Sua conta foi desativada pelo administrador.',
        icon: 'fas fa-user-slash',
        variant: 'warning'
      },
      'PENDENTE': {
        title: 'Conta Pendente',
        description: 'Sua conta está aguardando aprovação do administrador.',
        icon: 'fas fa-clock',
        variant: 'info'
      },
      'BLOQUEADA': {
        title: 'Conta Bloqueada',
        description: 'Sua conta foi bloqueada por motivos de segurança.',
        icon: 'fas fa-ban',
        variant: 'danger'
      }
    };
    return messages[status] || messages['INATIVA'];
  };

  const statusInfo = getStatusMessage(reason || user?.statusConta);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleContactAdmin = () => {
    // Aqui você pode implementar um modal de contato ou redirecionar para email
    window.location.href = 'mailto:admin@seduc.ma.gov.br?subject=Solicitação de Ativação de Conta&body=Olá, preciso de ajuda com minha conta no SISREC.';
  };

  return (
    <div className="account-suspended-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="suspended-card">
              <Card.Body className="text-center p-5">
                <div className={`status-icon mb-4 text-${statusInfo.variant}`}>
                  <i className={statusInfo.icon}></i>
                </div>
                
                <h1 className="status-title">{statusInfo.title}</h1>
                
                <p className="status-description">
                  {message || statusInfo.description}
                </p>

                {user && (
                  <Alert variant={statusInfo.variant} className="text-start">
                    <div><strong>Usuário:</strong> {user.nome}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Status da conta:</strong> {reason || user.statusConta}</div>
                  </Alert>
                )}

                <div className="status-actions">
                  <Button 
                    variant="primary" 
                    className="me-3"
                    onClick={handleContactAdmin}
                  >
                    <i className="fas fa-envelope me-2"></i>
                    Contatar Administrador
                  </Button>
                  
                  <Button 
                    variant="outline-secondary"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Fazer Logout
                  </Button>
                </div>

                <div className="help-text mt-4">
                  <h6>O que fazer agora?</h6>
                  <ul className="text-start">
                    {reason === 'PENDENTE' && (
                      <>
                        <li>Aguarde a aprovação do administrador</li>
                        <li>Verifique seu email regularmente</li>
                        <li>Entre em contato se demorar mais de 48h</li>
                      </>
                    )}
                    {reason === 'INATIVA' && (
                      <>
                        <li>Entre em contato com o administrador</li>
                        <li>Forneça seu nome completo e CPF</li>
                        <li>Explique o motivo da solicitação</li>
                      </>
                    )}
                    {reason === 'BLOQUEADA' && (
                      <>
                        <li>Verifique se houve tentativas de acesso suspeitas</li>
                        <li>Entre em contato imediatamente com o administrador</li>
                        <li>Tenha seus dados pessoais em mãos</li>
                      </>
                    )}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AccountSuspendedPage;