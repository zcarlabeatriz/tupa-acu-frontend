import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { authService } from '../../../services/api/authService';
import Loading from '../../common/Loading/Loading';
import './ForgotPassword.css';

// Schema de validação
const forgotSchema = yup.object({
  email: yup.string().email('Digite um email válido').required('Email é obrigatório')
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm({
    resolver: yupResolver(forgotSchema),
    defaultValues: { email: '' }
  });

  React.useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Chamada para API de recuperação de senha
      const result = await authService.forgotPassword(data.email);
      if (result.success) {
        setSuccessMsg('Enviamos um link de redefinição de senha para seu email. Verifique sua caixa de entrada (e spam).');
        toast.success('Email enviado com sucesso!');
        reset();
      } else {
        setErrorMsg(result.error || 'Erro ao enviar email. Tente novamente.');
        toast.error(result.error || 'Erro ao enviar email.');
      }
    } catch (err) {
      setErrorMsg('Erro inesperado. Tente novamente.');
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <Container fluid>
        <Row className="min-vh-100">
          {/* Lado esquerdo: informações */}
          <Col lg={6} className="forgot-info-side d-none d-lg-flex">
            <div className="forgot-info-content">
              <div className="logo-container mb-4">
                <img 
                  src="/logo-seduc.png" 
                  alt="SEDUC/MA" 
                  className="logo-img"
                  onError={e => e.target.style.display = 'none'}
                />
                <h1 className="logo-text">SISREC</h1>
              </div>
              <h2 className="info-title">
                Recuperação de senha
              </h2>
              <p className="info-description">
                Esqueceu sua senha? Não se preocupe! Informe seu email cadastrado e enviaremos um link para redefinir sua senha.
              </p>
              <ul className="forgot-benefits">
                <li><i className="fas fa-envelope"></i> Email seguro e rápido</li>
                <li><i className="fas fa-lock"></i> Proteção dos seus dados</li>
                <li><i className="fas fa-user"></i> Suporte ao usuário</li>
              </ul>
            </div>
          </Col>
          {/* Formulário à direita */}
          <Col lg={6} className="forgot-form-side">
            <div className="forgot-form-container">
              <Card className="forgot-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="forgot-title">Recuperar Senha</h3>
                    <p className="forgot-subtitle text-muted">
                      Informe seu email para receber o link de redefinição
                    </p>
                  </div>
                  {successMsg && (
                    <Alert variant="success" className="mb-3">{successMsg}</Alert>
                  )}
                  {errorMsg && (
                    <Alert variant="danger" className="mb-3">{errorMsg}</Alert>
                  )}
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-4">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Digite seu email cadastrado"
                          {...register('email')}
                          isInvalid={!!errors.email}
                          autoComplete="email"
                        />
                      </InputGroup>
                      {errors.email && (
                        <Form.Control.Feedback type="invalid">
                          {errors.email.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 forgot-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Enviar link de recuperação
                        </>
                      )}
                    </Button>
                  </Form>
                  <div className="text-center mt-4">
                    <Link 
                      to="/login" 
                      className="text-decoration-none fw-bold"
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Voltar para Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
              <div className="text-center mt-3">
                <small className="text-muted">
                  © 2024 SEDUC/MA - Sistema de Recepção v1.0.0
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;