import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, 
  Breadcrumb, Modal, Badge, InputGroup, Tab, Tabs 
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { formatCPF, formatPhone, removeFormatting } from '../../services/utils/formatters';
import Loading from '../../components/common/Loading/Loading';
import './ProfilePage.css';

// Schema de validação
const profileSchema = yup.object({
  nome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  celular: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
});

const passwordSchema = yup.object({
  senhaAtual: yup
    .string()
    .required('Senha atual é obrigatória'),
  novaSenha: yup
    .string()
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .required('Nova senha é obrigatória'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('novaSenha'), null], 'Senhas devem coincidir')
    .required('Confirmação de senha é obrigatória')
});

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const { user } = useAuth();

  // Form para dados do perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    setValue: setValueProfile,
    watch: watchProfile,
    reset: resetProfile
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nome: '',
      email: '',
      celular: '',
      cpf: ''
    }
  });

  // Form para mudança de senha
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      resetProfile({
        nome: user.nome || '',
        email: user.email || '',
        celular: user.celular || '',
        cpf: user.cpf || ''
      });
      setProfileImagePreview(user.fotoUrl);
    }
  }, [user, resetProfile]);

  // Formatação automática dos campos
  const celularValue = watchProfile('celular');
  useEffect(() => {
    if (celularValue) {
      const formatted = formatPhone(celularValue);
      if (formatted !== celularValue) {
        setValueProfile('celular', formatted);
      }
    }
  }, [celularValue, setValueProfile]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB.');
        return;
      }

      setProfileImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    try {
      // Aqui você faria a chamada para a API para atualizar o perfil
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('email', data.email);
      formData.append('celular', removeFormatting(data.celular));
      formData.append('cpf', removeFormatting(data.cpf));
      
      if (profileImage) {
        formData.append('foto', profileImage);
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoading(true);
    try {
      // Aqui você faria a chamada para a API para alterar a senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Senha alterada com sucesso!');
      setShowChangePassword(false);
      resetPassword();
    } catch (error) {
      toast.error('Erro ao alterar senha. Verifique sua senha atual.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'ADMIN': 'Administrador',
      'SERVIDOR': 'Servidor',
      'RECEPCIONISTA': 'Recepcionista',
      'VISITANTE': 'Visitante'
    };
    return roles[role] || role;
  };

  const getStatusDisplay = (status) => {
    const statuses = {
      'ATIVA': { label: 'Ativa', variant: 'success' },
      'INATIVA': { label: 'Inativa', variant: 'secondary' },
      'PENDENTE': { label: 'Pendente', variant: 'warning' },
      'BLOQUEADA': { label: 'Bloqueada', variant: 'danger' }
    };
    return statuses[status] || { label: status, variant: 'secondary' };
  };

  return (
    <div className="profile-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Meu Perfil</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-user-circle me-3"></i>
                Meu Perfil
              </h1>
              <p className="text-muted">
                Gerencie suas informações pessoais e configurações da conta
              </p>
            </Col>
          </Row>
        </div>

        <Row>
          {/* Sidebar do perfil */}
          <Col lg={4} className="mb-4">
            <Card className="profile-sidebar">
              <Card.Body className="text-center">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-container">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Avatar" 
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <label htmlFor="avatar-upload" className="avatar-upload-btn">
                        <i className="fas fa-camera"></i>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <h4 className="profile-name">{user?.nome}</h4>
                <p className="profile-email text-muted">{user?.email}</p>
                
                <div className="profile-badges">
                  <Badge bg="primary" className="me-2">
                    {getRoleDisplay(user?.papel)}
                  </Badge>
                  <Badge bg={getStatusDisplay(user?.statusConta).variant}>
                    {getStatusDisplay(user?.statusConta).label}
                  </Badge>
                </div>

                <div className="profile-stats mt-4">
                  <Row>
                    <Col className="text-center">
                      <div className="stat-number">
                        {new Date(user?.dataCriacao).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="stat-label">Membro desde</div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>

            {/* Informações do sistema */}
            <Card className="system-info-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Informações da Conta
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value">#{user?.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">CPF:</span>
                  <span className="info-value">{formatCPF(user?.cpf)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Último acesso:</span>
                  <span className="info-value">
                    {user?.dataAtualizacao ? 
                      new Date(user.dataAtualizacao).toLocaleString('pt-BR') : 
                      'Não disponível'
                    }
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Conteúdo principal */}
          <Col lg={8}>
            <Card className="profile-content">
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={setActiveTab}
                  className="profile-tabs"
                >
                  {/* Tab: Informações Pessoais */}
                  <Tab eventKey="profile" title={<><i className="fas fa-user me-2"></i>Informações Pessoais</>}>
                    <div className="tab-content-wrapper">
                      <Form onSubmit={handleSubmitProfile(onSubmitProfile)} noValidate>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nome Completo</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Digite seu nome completo"
                                {...registerProfile('nome')}
                                isInvalid={!!errorsProfile.nome}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errorsProfile.nome?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                {...registerProfile('email')}
                                isInvalid={!!errorsProfile.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errorsProfile.email?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CPF</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="000.000.000-00"
                                {...registerProfile('cpf')}
                                isInvalid={!!errorsProfile.cpf}
                                readOnly
                                className="bg-light"
                              />
                              <Form.Text className="text-muted">
                                O CPF não pode ser alterado
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Celular</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="(99) 99999-9999"
                                {...registerProfile('celular')}
                                isInvalid={!!errorsProfile.celular}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errorsProfile.celular?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="form-actions">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="me-3"
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Salvando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Salvar Alterações
                              </>
                            )}
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => resetProfile()}
                          >
                            <i className="fas fa-undo me-2"></i>
                            Cancelar
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Tab>

                  {/* Tab: Segurança */}
                  <Tab eventKey="security" title={<><i className="fas fa-shield-alt me-2"></i>Segurança</>}>
                    <div className="tab-content-wrapper">
                      <div className="security-section">
                        <h5>Alterar Senha</h5>
                        <p className="text-muted">
                          Para sua segurança, recomendamos alterar sua senha regularmente.
                        </p>
                        
                        <Button
                          variant="outline-primary"
                          onClick={() => setShowChangePassword(true)}
                        >
                          <i className="fas fa-key me-2"></i>
                          Alterar Senha
                        </Button>
                      </div>

                      <hr />

                      <div className="security-section">
                        <h5>Sessões Ativas</h5>
                        <p className="text-muted">
                          Gerencie onde você está logado.
                        </p>
                        
                        <div className="session-item">
                          <div className="session-info">
                            <div className="session-device">
                              <i className="fas fa-desktop me-2"></i>
                              Navegador Web - Windows
                            </div>
                            <div className="session-details">
                              <small className="text-muted">
                                Último acesso: Agora • IP: 192.168.1.100
                              </small>
                            </div>
                          </div>
                          <Badge bg="success">Atual</Badge>
                        </div>
                      </div>
                    </div>
                  </Tab>

                  {/* Tab: Notificações */}
                  <Tab eventKey="notifications" title={<><i className="fas fa-bell me-2"></i>Notificações</>}>
                    <div className="tab-content-wrapper">
                      <h5>Preferências de Notificação</h5>
                      <p className="text-muted">
                        Configure como você deseja receber notificações do sistema.
                      </p>

                      <div className="notification-settings">
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Notificações por email"
                          defaultChecked
                          className="mb-3"
                        />
                        
                        <Form.Check
                          type="switch"
                          id="visit-notifications"
                          label="Notificações de visitas"
                          defaultChecked
                          className="mb-3"
                        />
                        
                        <Form.Check
                          type="switch"
                          id="system-notifications"
                          label="Notificações do sistema"
                          defaultChecked
                          className="mb-3"
                        />
                        
                        <Form.Check
                          type="switch"
                          id="security-notifications"
                          label="Alertas de segurança"
                          defaultChecked
                          className="mb-3"
                        />
                      </div>

                      <Button variant="primary">
                        <i className="fas fa-save me-2"></i>
                        Salvar Preferências
                      </Button>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para alterar senha */}
      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-key me-2"></i>
            Alterar Senha
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Senha Atual</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha atual"
                {...registerPassword('senhaAtual')}
                isInvalid={!!errorsPassword.senhaAtual}
              />
              <Form.Control.Feedback type="invalid">
                {errorsPassword.senhaAtual?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua nova senha"
                {...registerPassword('novaSenha')}
                isInvalid={!!errorsPassword.novaSenha}
              />
              <Form.Control.Feedback type="invalid">
                {errorsPassword.novaSenha?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Nova Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme sua nova senha"
                {...registerPassword('confirmarSenha')}
                isInvalid={!!errorsPassword.confirmarSenha}
              />
              <Form.Control.Feedback type="invalid">
                {errorsPassword.confirmarSenha?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-fill"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Alterando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Alterar Senha
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setShowChangePassword(false);
                  resetPassword();
                }}
                className="flex-fill"
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfilePage;