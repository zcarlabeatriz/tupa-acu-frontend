import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useAuth } from '../../../hooks/useAuth';
import { loginSchema } from '../../../services/utils/validators';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../common/Loading/Loading';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: ''
    }
  });

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(from, { replace: true });
  //   }
  // }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    setIsLoginLoading(true);
    
    try {
      const result = await login(data.email, data.senha);
      
      if (result.success) {
        toast.success('Login realizado com sucesso!');
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return <Loading fullPage text="Fazendo login..." />;
  // }

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="min-vh-100">
          {/* Lado esquerdo - Informações */}
          <Col lg={6} className="login-info-side d-none d-lg-flex">
            <div className="login-info-content">
              <div className="logo-container mb-4">
                <img 
                  src="/logo-seduc.png" 
                  alt="SEDUC/MA" 
                  className="logo-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <h1 className="logo-text">SISREC</h1>
              </div>
              <h2 className="info-title">
                Sistema de Recepção
              </h2>
              <p className="info-description">
                Gerencie visitantes e servidores com eficiência e segurança. 
                Controle de acesso, agendamentos e relatórios em uma plataforma completa.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Controle de visitantes</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Agendamento de visitas</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Geração de QR Code</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Relatórios detalhados</span>
                </div>
              </div>
            </div>
          </Col>

          {/* Lado direito - Formulário */}
          <Col lg={6} className="login-form-side">
            <div className="login-form-container">
              <Card className="login-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="login-title">Bem-vindo de volta!</h3>
                    <p className="login-subtitle text-muted">
                      Faça login para acessar o sistema
                    </p>
                  </div>

                  {location.state?.message && (
                    <Alert variant="info" className="mb-4">
                      {location.state.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Digite seu email"
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

                    <Form.Group className="mb-4">
                      <Form.Label>Senha</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          {...register('senha')}
                          isInvalid={!!errors.senha}
                          autoComplete="current-password"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </Button>
                      </InputGroup>
                      {errors.senha && (
                        <Form.Control.Feedback type="invalid">
                          {errors.senha.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Lembrar de mim"
                        id="remember-me"
                      />
                      <Link 
                        to="/forgot-password" 
                        className="text-decoration-none"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 login-btn"
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
                          Entrando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Entrar
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Não tem uma conta?{' '}
                      <Link 
                        to="/register" 
                        className="text-decoration-none fw-bold"
                      >
                        Registre-se aqui
                      </Link>
                    </p>
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

export default Login;