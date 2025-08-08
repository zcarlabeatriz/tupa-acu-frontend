import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Breadcrumb, ProgressBar, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import './DashboardPage.css';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const { user } = useAuth();
  const { canManageVisitas, canManageServidores } = usePermissions();

  useEffect(() => {
    // Simular carregamento dos dados do dashboard
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
      setStats({
        visitasHoje: 14,
        visitasPendentes: 6,
        visitasAprovadas: 8,
        visitantesCadastrados: 104,
        servidoresAtivos: 45,
        setores: 8,
        visitasPorSetor: [
          { setor: 'Gabinete', qtd: 3 },
          { setor: 'Financeiro', qtd: 2 },
          { setor: 'RH', qtd: 4 },
          { setor: 'Tecnologia', qtd: 1 }
        ],
        visitasPorStatus: [
          { status: 'Aprovadas', qtd: 8, variant: 'success' },
          { status: 'Pendentes', qtd: 6, variant: 'warning' },
          { status: 'Rejeitadas', qtd: 1, variant: 'danger' }
        ],
        ultimasVisitas: [
          {
            id: 1,
            visitante: 'João Silva',
            setor: 'RH',
            servidor: 'Maria Rocha',
            status: 'Aprovada',
            hora: '09:20',
            variant: 'success'
          },
          {
            id: 2,
            visitante: 'Lucas Almeida',
            setor: 'Gabinete',
            servidor: 'Carlos Souza',
            status: 'Pendente',
            hora: '10:45',
            variant: 'warning'
          },
          {
            id: 3,
            visitante: 'Ana Paula',
            setor: 'Financeiro',
            servidor: 'Fernanda Lima',
            status: 'Rejeitada',
            hora: '11:10',
            variant: 'danger'
          }
        ]
      });
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return <Loading fullPage text="Carregando dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-chart-line me-3"></i>
                Dashboard
              </h1>
              <p className="text-muted">
                Visão geral das visitas, servidores e setores do SISREC
              </p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <Badge bg="primary" className="px-3 py-2">
                <i className="fas fa-user-tag me-2"></i>
                {user?.papel}
              </Badge>
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="cards-container grid-4 mb-4">
          <Col>
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-calendar-day"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{stats.visitasHoje}</h3>
                    <p className="stat-label">Visitas hoje</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-clock"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{stats.visitasPendentes}</h3>
                    <p className="stat-label">Pendentes</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="stat-card stat-success">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{stats.visitasAprovadas}</h3>
                    <p className="stat-label">Aprovadas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-users"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{stats.visitantesCadastrados}</h3>
                    <p className="stat-label">Visitantes</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráfico de visitas por setor */}
        <Row className="mb-4">
          <Col lg={6} className="mb-4">
            <Card className="dashboard-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-building me-2"></i>
                  Visitas por Setor
                </h6>
              </Card.Header>
              <Card.Body>
                {stats.visitasPorSetor.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-3">
                    <div className="flex-grow-1">
                      <span className="fw-bold">{item.setor}</span>
                    </div>
                    <ProgressBar
                      now={item.qtd * 10}
                      label={item.qtd}
                      variant="primary"
                      style={{ minWidth: 120, maxWidth: 200 }}
                    />
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card className="dashboard-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Visitas por Status
                </h6>
              </Card.Header>
              <Card.Body>
                {stats.visitasPorStatus.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-3">
                    <Badge bg={item.variant} className="me-3 px-3 py-2">{item.status}</Badge>
                    <ProgressBar
                      now={item.qtd * 12}
                      label={item.qtd}
                      variant={item.variant}
                      style={{ minWidth: 120, maxWidth: 200 }}
                    />
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Listagem das últimas visitas */}
        <Row>
          <Col lg={8} className="mb-4">
            <Card className="dashboard-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Últimas Visitas
                </h6>
              </Card.Header>
              <Card.Body>
                <ListGroup>
                  {stats.ultimasVisitas.map(v => (
                    <ListGroup.Item key={v.id} className="d-flex align-items-center">
                      <Badge bg={v.variant} className="me-3">{v.status}</Badge>
                      <div className="flex-grow-1">
                        <span className="fw-bold">{v.visitante}</span>
                        <span className="mx-2 text-muted small">Setor: {v.setor}</span>
                        <span className="mx-2 text-muted small">Servidor: {v.servidor}</span>
                        <span className="mx-2 text-secondary small">{v.hora}</span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card className="dashboard-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-database me-2"></i>
                  Resumo do Sistema
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="system-summary">
                  <div className="summary-item">
                    <span className="summary-label">Servidores ativos:</span>
                    <span className="summary-value">{stats.servidoresAtivos}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Setores cadastrados:</span>
                    <span className="summary-value">{stats.setores}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Visitantes:</span>
                    <span className="summary-value">{stats.visitantesCadastrados}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Visitas hoje:</span>
                    <span className="summary-value">{stats.visitasHoje}</span>
                  </div>
                </div>
                {canManageVisitas() && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100 mt-4"
                    href="/visitas"
                  >
                    <i className="fas fa-calendar-plus me-2"></i>
                    Gerenciar Visitas
                  </Button>
                )}
                {canManageServidores() && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100 mt-2"
                    href="/servidores"
                  >
                    <i className="fas fa-user-tie me-2"></i>
                    Gerenciar Servidores
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardPage;