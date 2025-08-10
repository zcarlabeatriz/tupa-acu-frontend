import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="footer-text">
              <span className="copyright">
                © {currentYear} SEDUC/MA - Secretaria de Estado da Educação do Maranhão
              </span>
            </div>
          </Col>
          <Col md={6}>
            <div className="footer-links">
              <span className="system-info">
                TUPA AÇU v1.0.0 | Sistema de Recepção
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;