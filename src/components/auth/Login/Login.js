import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSchema } from '../../../services/utils/validators';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../services/utils/constants';
import logo from '../../../assets/images/tuapa-acu.png';
// import Loading from '../../common/Loading/Loading';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, isAuthenticated, clearError, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();



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
    },
    mode: 'onChange' 
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Determinar o redirecionamento baseado no papel do usuário atual
      const redirectPath = location.state?.from?.pathname || 
        (user.papel?.trim() === ROLES.VISITANTE ? '/visitas' : '/dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  
  // useEffect(() => {
  //   if (localError && (emailValue || senhaValue)) {
  //     setLocalError('');
  //   }
  // }, [emailValue, senhaValue, localError]);

  // ✅ Função de submit mais robusta
  const onSubmit = async (data) => {
    
    
    // Prevenir múltiplos submits
    if (isLoginLoading) {
      return;
    }
    
    setIsLoginLoading(true);
    setLocalError('');
    
    try {
      
      const result = await login(data.email, data.senha);
      
      
      if (result && result.success) {
        
        toast.success('Login realizado com sucesso!', {
          position: "top-right",
          autoClose: 3000,
        });
        // Pequeno delay para mostrar o toast e determinar redirecionamento
        setTimeout(() => {
          // Aguardar um pouco mais para garantir que o user foi atualizado no contexto
          const checkUserAndRedirect = () => {
            if (user && user.papel) {
              const redirectPath = location.state?.from?.pathname || 
                (user.papel.trim() === ROLES.VISITANTE ? '/visitas' : '/dashboard');
              navigate(redirectPath, { replace: true });
            } else {
              // Se o user ainda não foi atualizado, tentar novamente em breve
              setTimeout(checkUserAndRedirect, 50);
            }
          };
          checkUserAndRedirect();
        }, 100);
      } else {
        const errorMsg = result?.error || 'Email ou senha incorretos';
       
        setLocalError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      
      const errorMsg = 'Erro de conexão. Verifique sua internet.';
      setLocalError(errorMsg);
      toast.error(errorMsg);
    } finally {
      
      setIsLoginLoading(false);
    }
  };

  // ✅ Handler para o evento do formulário
  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    handleSubmit(onSubmit)(e); 
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="min-vh-100">
          {/* Lado esquerdo - Informações */}
          <Col lg={6} className="login-info-side d-none d-lg-flex">
            <div className="login-info-content">
              <div className="logo-container mb-4">
                <img 
                  src={logo} 
                  alt="logo tupa-acu" 
                  className="logo-img"
                  
                />
                <h1 className="logo-text">TUPÃ-AÇU</h1>
              </div>
              <h2 className="info-title">
                Sistema de Recepção
              </h2>
            </div>
          </Col>

          {/* Lado direito - Formulário */}
          <Col lg={6} className="login-form-side">
            <div className="login-form-container">
              <Card className="login-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4 bg-blue-500">
                    {/* <h3 className="login-title">Bem-vindo de volta!</h3> */}
                    <p className="login-subtitle text-muted">
                      Faça login para acessar o sistema
                    </p>
                  </div>

                  {location.state?.message && (
                    <Alert variant="info" className="mb-4">
                      {location.state.message}
                    </Alert>
                  )}

                  {localError && (
                    <Alert variant="danger" className="mb-4" dismissible onClose={() => setLocalError('')}>
                      <Alert.Heading as="h6">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Erro de Login
                      </Alert.Heading>
                      <p className="mb-0">{localError}</p>
                    </Alert>
                  )}

                  {/* ✅ Form com handler personalizado */}
                  <Form onSubmit={handleFormSubmit} noValidate>
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
                          disabled={isLoginLoading}
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
                          disabled={isLoginLoading}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={(e) => {
                            e.preventDefault(); // ✅ Prevenir submit
                            setShowPassword(!showPassword);
                          }}
                          type="button"
                          disabled={isLoginLoading}
                          tabIndex={-1} // ✅ Evitar foco por tab
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
                        disabled={isLoginLoading}
                      />
                      <Link 
                        to="/forgot-password" 
                        className={`text-decoration-none ${isLoginLoading ? 'text-muted' : ''}`}
                        onClick={(e) => isLoginLoading && e.preventDefault()}
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 login-btn"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? (
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
                        className={`text-decoration-none fw-bold ${isLoginLoading ? 'text-muted' : ''}`}
                        onClick={(e) => isLoginLoading && e.preventDefault()}
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