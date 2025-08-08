import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../../../services/utils/validators';
import { authService } from '../../../services/api/authService';
import { formatPhone } from '../../../services/utils/formatters';
import Loading from '../../common/Loading/Loading';
import './Register.css';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      cpf: '',
      celular: ''
    }
  });

  useEffect(() => {
    setFocus('nome');
  }, [setFocus]);

  // Formatação automática do celular
  const celularValue = watch('celular');
  useEffect(() => {
    if (celularValue) {
      const formatted = formatPhone(celularValue);
      if (formatted !== celularValue) {
        setValue('celular', formatted);
      }
    }
  }, [celularValue, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.register({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf,
        celular: data.celular ? data.celular.replace(/\D/g, '') : '',
      });

      if (result.success) {
        toast.success('Cadastro realizado com sucesso! Faça login para acessar o sistema.');
        navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Verifique seu email para ativar a conta.' } });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container fluid>
        <Row className="min-vh-100">
          {/* Informações à esquerda */}
          <Col lg={6} className="register-info-side d-none d-lg-flex">
            <div className="register-info-content">
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
                Cadastro de novo usuário
              </h2>
              <p className="info-description">
                Preencha seus dados para criar uma conta e ter acesso ao sistema.
                Após registrar, sua conta poderá precisar ser aprovada por um administrador.
              </p>
              <ul className="register-benefits">
                <li><i className="fas fa-check-circle"></i> Acesso ao agendamento de visitas</li>
                <li><i className="fas fa-check-circle"></i> Controle das suas visitas</li>
                <li><i className="fas fa-check-circle"></i> Notificações por email</li>
                <li><i className="fas fa-check-circle"></i> Cadastro seguro</li>
              </ul>
            </div>
          </Col>
          {/* Formulário à direita */}
          <Col lg={6} className="register-form-side">
            <div className="register-form-container">
              <Card className="register-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="register-title">Crie sua conta</h3>
                    <p className="register-subtitle text-muted">
                      Preencha os dados abaixo para registrar-se
                    </p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-user"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Seu nome completo"
                          {...register('nome')}
                          isInvalid={!!errors.nome}
                          autoFocus
                        />
                      </InputGroup>
                      {errors.nome && (
                        <Form.Control.Feedback type="invalid">
                          {errors.nome.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Seu email"
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
                    
                    <Form.Group className="mb-3">
                      <Form.Label>CPF</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-id-card"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Apenas números"
                          {...register('cpf')}
                          isInvalid={!!errors.cpf}
                          maxLength={11}
                          autoComplete="off"
                        />
                      </InputGroup>
                      {errors.cpf && (
                        <Form.Control.Feedback type="invalid">
                          {errors.cpf.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Celular</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-phone"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="(99) 99999-9999"
                          {...register('celular')}
                          isInvalid={!!errors.celular}
                          autoComplete="tel"
                        />
                      </InputGroup>
                      {errors.celular && (
                        <Form.Control.Feedback type="invalid">
                          {errors.celular.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Senha</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          placeholder="Crie uma senha"
                          {...register('senha')}
                          isInvalid={!!errors.senha}
                          autoComplete="new-password"
                        />
                      </InputGroup>
                      {errors.senha && (
                        <Form.Control.Feedback type="invalid">
                          {errors.senha.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar Senha</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          placeholder="Confirme sua senha"
                          {...register('confirmarSenha')}
                          isInvalid={!!errors.confirmarSenha}
                          autoComplete="new-password"
                        />
                      </InputGroup>
                      {errors.confirmarSenha && (
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmarSenha.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 register-btn"
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
                          Registrando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Registrar
                        </>
                      )}
                    </Button>
                  </Form>
                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Já tem uma conta?{' '}
                      <Link 
                        to="/login" 
                        className="text-decoration-none fw-bold"
                      >
                        Entrar
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

export default Register;