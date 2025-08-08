import React from 'react';
import { Container, Row, Col, Card, Accordion, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HelpPage.css';

const faqs = [
  {
    question: 'Como agendar uma visita?',
    answer: 'Acesse o menu Visitas > Agendar Visita e preencha o formulário com os dados do visitante e do servidor a ser visitado.'
  },
  {
    question: 'Como aprovar ou rejeitar uma visita?',
    answer: 'Servidores e administradores têm acesso à lista de visitas pendentes, onde é possível aprovar ou rejeitar cada solicitação.'
  },
  {
    question: 'Esqueci minha senha. O que fazer?',
    answer: 'Clique em "Esqueceu a senha?" na tela de login e siga as instruções para redefinir sua senha por email.'
  },
  {
    question: 'Como atualizar meus dados pessoais?',
    answer: 'Vá até Meu Perfil para editar seu nome, email ou foto. O CPF não pode ser alterado pelo usuário.'
  }
];

const HelpPage = () => (
  <div className="help-page">
    <Container fluid>
      <div className="page-breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Ajuda</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-header mb-4">
        <h1>
          <i className="fas fa-question-circle me-3"></i>
          Central de Ajuda
        </h1>
        <p className="text-muted">
          Dúvidas frequentes e informações úteis sobre o SISREC
        </p>
      </div>

      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                Perguntas Frequentes
              </h5>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {faqs.map((faq, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={idx}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <i className="fas fa-headset me-2"></i>
              Fale Conosco
            </Card.Header>
            <Card.Body>
              <p>
                Precisa de ajuda? Entre em contato com o suporte técnico:<br />
                <strong>Email:</strong> suporte.sisrec@seduc.ma.gov.br<br />
                <strong>Telefone:</strong> (98) 3131-0000
              </p>
              <p>
                <a href="mailto:suporte.sisrec@seduc.ma.gov.br" className="btn btn-primary">
                  <i className="fas fa-envelope me-2"></i>
                  Enviar Email
                </a>
              </p>
              <hr />
              <div className="help-extra-links">
                <Link to="/notifications" className="text-decoration-none me-3">
                  <i className="fas fa-bell me-1"></i>
                  Notificações do sistema
                </Link>
                <Link to="/settings" className="text-decoration-none">
                  <i className="fas fa-cog me-1"></i>
                  Configurações
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default HelpPage;