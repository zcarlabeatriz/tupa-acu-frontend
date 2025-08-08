import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="notfound-card">
              <Card.Body className="text-center p-5">
                <div className="notfound-emoji mb-4">😢</div>
                <h1 className="notfound-title">404 - Página não encontrada</h1>
                <p className="notfound-description">
                  Ops! Não encontramos a página que você está procurando.<br />
                  Ela pode ter sido removida, renomeada ou está temporariamente indisponível.
                </p>
                <div className="notfound-actions mt-4">
                  <Button 
                    variant="primary" 
                    className="me-3"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Voltar
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    as={Link} 
                    to="/home"
                  >
                    <i className="fas fa-home me-2"></i>
                    Ir para Home
                  </Button>
                </div>
                <div className="notfound-help mt-4">
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

export default NotFoundPage;