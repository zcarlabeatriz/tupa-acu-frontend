import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import './HomePage.css';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({});
  const { user } = useAuth();
  const {
    canViewDashboard,
    canManageVisitas,
    canScheduleVisitas,
    canControlRecepcao,
    canManagePessoas,
    canManageServidores
  } = usePermissions();

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      try {
        // Aqui você faria chamadas para a API para buscar estatísticas rápidas
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setQuickStats({
          visitasHoje: 12,
          visitasPendentes: 5,
          servidoresAtivos: 45,
          setoresTotal: 8
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
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

  const quickActions = [
    {
      title: 'Agendar Visita',
      description: 'Criar um novo agendamento de visita',
      icon: 'fas fa-calendar-plus',
      path: '/visitas/nova',
      color: 'primary',
      show: canScheduleVisitas()
    },
    {
      title: 'Controle Recepção',
      description: 'Gerenciar entrada e saída de visitantes',
      icon: 'fas fa-desktop',
      path: '/visitas/recepcao',
      color: 'success',
      show: canControlRecepcao()
    },
    {
      title: 'Ver Dashboard',
      description: 'Acessar painel principal com relatórios',
      icon: 'fas fa-chart-line',
      path: '/dashboard',
      color: 'info',
      show: canViewDashboard()
    },
    {
      title: 'Gerenciar Pessoas',
      description: 'Cadastrar e editar pessoas no sistema',
      icon: 'fas fa-users',
      path: '/pessoas',
      color: 'warning',
      show: canManagePessoas()
    },
    {
      title: 'Gerenciar Servidores',
      description: 'Administrar cadastro de servidores',
      icon: 'fas fa-user-tie',
      path: '/servidores',
      color: 'secondary',
      show: canManageServidores()
    },
    {
      title: 'Minhas Visitas',
      description: 'Ver suas visitas agendadas',
      icon: 'fas fa-calendar-check',
      path: '/visitas',
      color: 'dark',
      show: canManageVisitas()
    }
  ].filter(action => action.show);

  const recentActivities = [
    {
      id: 1,
      type: 'visita_agendada',
      title: 'Nova visita agendada',
      description: 'João Silva agendou visita para 15:00',
      time: '10 min atrás',
      icon: 'fas fa-calendar-plus',
      color: 'success'
    },
    {
      id: 2,
      type: 'visita_aprovada',
      title: 'Visita aprovada',
      description: 'Visita de Maria Santos foi aprovada',
      time: '30 min atrás',
      icon: 'fas fa-check-circle',
      color: 'primary'
    },
    {
      id: 3,
      type: 'servidor_cadastrado',
      title: 'Novo servidor cadastrado',
      description: 'Pedro Oliveira foi adicionado ao sistema',
      time: '1 hora atrás',
      icon: 'fas fa-user-plus',
      color: 'info'
    }
  ];

  if (isLoading) {
    return <Loading fullPage text="Carregando página inicial..." />;
  }

  return (
    <div className="home-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item active>Home</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Cabeçalho de boas-vindas */}
        <div className="welcome-section">
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="welcome-content">
                <h1 className="welcome-title">
                  {getGreeting()}, {user?.nome?.split(' ')[0]}! 👋
                </h1>
                <p className="welcome-subtitle">
                  Bem-vindo(a) ao SISREC - Sistema de Recepção da SEDUC/MA
                </p>
                <div className="user-role-badge">
                  <Badge bg="primary" className="px-3 py-2">
                    <i className="fas fa-user-tag me-2"></i>
                    {getRoleDisplay(user?.papel)}
                  </Badge>
                </div>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div className="welcome-date">
                <div className="current-date">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="current-time">
                  {new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">{quickStats.visitasHoje}</h3>
                    <p className="stat-label">Visitas Hoje</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">{quickStats.visitasPendentes}</h3>
                    <p className="stat-label">Pendentes</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card stat-success">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">{quickStats.servidoresAtivos}</h3>
                    <p className="stat-label">Servidores Ativos</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-number">{quickStats.setoresTotal}</h3>
                    <p className="stat-label">Setores</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Ações rápidas */}
          <Col lg={8}>
            <Card className="actions-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Ações Rápidas
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {quickActions.map((action, index) => (
                    <Col lg={6} className="mb-3" key={index}>
                      <Card 
                        className={`action-card action-${action.color}`}
                        as={Link}
                        to={action.path}
                      >
                        <Card.Body>
                          <div className="action-content">
                            <div className="action-icon">
                              <i className={action.icon}></i>
                            </div>
                            <div className="action-details">
                              <h6 className="action-title">{action.title}</h6>
                              <p className="action-description">{action.description}</p>
                            </div>
                            <div className="action-arrow">
                              <i className="fas fa-chevron-right"></i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                
                {quickActions.length === 0 && (
                  <Alert variant="info" className="text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    Nenhuma ação rápida disponível para seu perfil.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Atividades recentes */}
          <Col lg={4}>
            <Card className="activities-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Atividades Recentes
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="activities-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon bg-${activity.color}`}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-content">
                        <h6 className="activity-title">{activity.title}</h6>
                        <p className="activity-description">{activity.description}</p>
                        <small className="activity-time text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-3">
                  <Button variant="outline-primary" size="sm" as={Link} to="/notifications">
                    Ver todas as atividades
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Links úteis */}
        <Row className="mt-4">
          <Col>
            <Card className="useful-links-card">
              <Card.Body>
                <h5 className="mb-3">
                  <i className="fas fa-external-link-alt me-2"></i>
                  Links Úteis
                </h5>
                <Row>
                  <Col md={3} className="mb-2">
                    <a 
                      href="https://www.educacao.ma.gov.br" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="useful-link"
                    >
                      <i className="fas fa-globe me-2"></i>
                      Portal SEDUC/MA
                    </a>
                  </Col>
                  <Col md={3} className="mb-2">
                    <a 
                      href="/help" 
                      className="useful-link"
                    >
                      <i className="fas fa-question-circle me-2"></i>
                      Central de Ajuda
                    </a>
                  </Col>
                  <Col md={3} className="mb-2">
                    <a 
                      href="mailto:suporte.sisrec@seduc.ma.gov.br" 
                      className="useful-link"
                    >
                      <i className="fas fa-envelope me-2"></i>
                      Suporte Técnico
                    </a>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Link to="/settings" className="useful-link">
                      <i className="fas fa-cog me-2"></i>
                      Configurações
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;