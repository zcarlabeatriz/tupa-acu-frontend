import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const { requiredRoles, userRole, message } = location.state || {};

  const getRoleDisplay = (role) => {
    const roles = {
      'ADMIN': 'Administrador',
      'SERVIDOR': 'Servidor',
      'RECEPCIONISTA': 'Recepcionista',
      'VISITANTE': 'Visitante'
    };
    return roles[role] || role;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // Redirecionar baseado no papel do usuário
    if (user?.papel === 'VISITANTE') {
      navigate('/visitas');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="error-card">
              <Card.Body className="text-center p-5">
                <div className="error-icon mb-4">
                  <i className="fas fa-shield-alt"></i>
                </div>
                
                <h1 className="error-title">Acesso Negado</h1>
                
                <p className="error-description">
                  {message || 'Você não tem permissão para acessar esta página.'}
                </p>

                {user && (
                  <Alert variant="info" className="text-start">
                    <div><strong>Usuário:</strong> {user.nome}</div>
                    <div><strong>Seu papel:</strong> {getRoleDisplay(userRole || user.papel)}</div>
                    {requiredRoles && (
                      <div>
                        <strong>Papéis necessários:</strong> {requiredRoles.map(getRoleDisplay).join(', ')}
                      </div>
                    )}
                  </Alert>
                )}

                <div className="error-actions">
                  <Button 
                    variant="primary" 
                    className="me-3"
                    onClick={handleGoBack}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Voltar
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    className="me-3"
                    onClick={handleGoHome}
                  >
                    <i className="fas fa-home me-2"></i>
                    Ir para Home
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
                  <p className="text-muted">
                    Se você acredita que deveria ter acesso a esta página, 
                    entre em contato com o administrador do sistema.
                  </p>
                  <Link to="/help" className="text-decoration-none">
                    <i className="fas fa-question-circle me-1"></i>
                    Central de Ajuda
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnauthorizedPage;