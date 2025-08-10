import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../../services/api/authService';
// import { handleCPFInput, handlePhoneInput, removeFormatting } from '../../../services/utils/formatters';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    celular: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpar erros quando usuário começar a digitar
    if (localError) setLocalError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Tratamento especial para CPF e telefone
    if (name === 'cpf') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: numbersOnly // Armazenar apenas números
        }));
      }
    } else if (name === 'celular') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: numbersOnly // Armazenar apenas números
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
    else if (formData.nome.length < 2) errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    
    if (!formData.cpf) errors.cpf = 'CPF é obrigatório';
    else if (formData.cpf.length !== 11) errors.cpf = 'CPF deve ter 11 dígitos';
    
    if (!formData.celular) errors.celular = 'Celular é obrigatório';
    else if (formData.celular.length < 10) errors.celular = 'Celular deve ter pelo menos 10 dígitos';
    
    if (!formData.senha) errors.senha = 'Senha é obrigatória';
    else if (formData.senha.length < 6) errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    
    if (!formData.confirmarSenha) errors.confirmarSenha = 'Confirmação de senha é obrigatória';
    else if (formData.senha !== formData.confirmarSenha) errors.confirmarSenha = 'Senhas não coincidem';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (!validateForm()) {
      setLocalError('Por favor, corrija os erros nos campos');
      return;
    }

    setIsLoading(true);
    setLocalError('');

    try {
      

      const result = await authService.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf, // Já está sem formatação
        celular: formData.celular, // Já está sem formatação
      });

      if (result.success) {
        toast.success('Cadastro realizado com sucesso! Faça login para acessar o sistema.');
        navigate('/login', { 
          state: { 
            message: 'Cadastro realizado com sucesso! Você pode fazer login agora.' 
          } 
        });
      } else {
        const errorMsg = result.error || 'Erro ao realizar cadastro';
        setLocalError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      
      const errorMsg = 'Erro inesperado. Tente novamente.';
      setLocalError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatação visual para exibição
  const getDisplayValue = (name, value) => {
    if (name === 'cpf' && value) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (name === 'celular' && value) {
      if (value.length <= 10) {
        return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div className="register-page">
      <Container fluid>
        <Row className="min-vh-100">
          {/* Informações à esquerda */}
          <Col lg={6} className="register-info-side d-none d-lg-flex">
            <div className="register-info-content">
              <div className="logo-container mb-4">
                <h1 className="logo-text">TUPÃ-AÇU</h1>
              </div>
              <h2 className="info-title">
                Cadastro de novo usuário
              </h2>
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

                  {localError && (
                    <Alert variant="danger" className="mb-4" dismissible onClose={() => setLocalError('')}>
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {localError}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-user"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="nome"
                          placeholder="Seu nome completo"
                          value={formData.nome}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.nome}
                          disabled={isLoading}
                        />
                      </InputGroup>
                      {fieldErrors.nome && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.nome}
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
                          name="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.email}
                          disabled={isLoading}
                        />
                      </InputGroup>
                      {fieldErrors.email && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.email}
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
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={getDisplayValue('cpf', formData.cpf)}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.cpf}
                          disabled={isLoading}
                          maxLength={14} // Com formatação
                        />
                      </InputGroup>
                      {fieldErrors.cpf && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.cpf}
                        </Form.Control.Feedback>
                      )}
                      <Form.Text className="text-muted">
                        Apenas números
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Celular</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-phone"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="celular"
                          placeholder="(99) 99999-9999"
                          value={getDisplayValue('celular', formData.celular)}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.celular}
                          disabled={isLoading}
                          maxLength={15} // Com formatação
                        />
                      </InputGroup>
                      {fieldErrors.celular && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.celular}
                        </Form.Control.Feedback>
                      )}
                      <Form.Text className="text-muted">
                        Apenas números
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Senha</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          name="senha"
                          placeholder="Mínimo 6 caracteres"
                          value={formData.senha}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.senha}
                          disabled={isLoading}
                        />
                      </InputGroup>
                      {fieldErrors.senha && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.senha}
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
                          name="confirmarSenha"
                          placeholder="Digite a senha novamente"
                          value={formData.confirmarSenha}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.confirmarSenha}
                          disabled={isLoading}
                        />
                      </InputGroup>
                      {fieldErrors.confirmarSenha && (
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.confirmarSenha}
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