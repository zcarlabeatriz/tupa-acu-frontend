import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// import { notificationsService } from '../../services/api/notificationsService';
import { notificacaoSchema } from '../../services/utils/validators';
import { formatDateTime, formatDate } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES } from '../../services/utils/constants';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import NotificationCard from '../../components/notifications/NotificationCard/NotificationCard';
import './NotificationsPage.css';

const NOTIFICATION_TYPES = {
  VISITA_AGENDADA: 'visita_agendada',
  VISITA_APROVADA: 'visita_aprovada',
  VISITA_REJEITADA: 'visita_rejeitada',
  VISITA_CANCELADA: 'visita_cancelada',
  LEMBRETE_VISITA: 'lembrete_visita',
  SISTEMA: 'sistema',
  MANUTENCAO: 'manutencao',
  ANIVERSARIO: 'aniversario',
  REUNIAO: 'reuniao'
};

const NotificationsPage = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingNotificacao, setEditingNotificacao] = useState(null);
  const [selectedNotificacao, setSelectedNotificacao] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterData, setFilterData] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificacaoToDelete, setNotificacaoToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('recebidas');
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  const { user } = useAuth();
  const { isAdmin, canManageNotifications } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(notificacaoSchema),
    defaultValues: {
      titulo: '',
      mensagem: '',
      tipo: NOTIFICATION_TYPES.SISTEMA,
      destinatarios: [],
      dataEnvio: '',
      horaEnvio: '',
      enviarEmail: true,
      prioridade: 'normal',
      expirarEm: ''
    }
  });

  const bulkForm = useForm({
    defaultValues: {
      titulo: '',
      mensagem: '',
      tipo: NOTIFICATION_TYPES.SISTEMA,
      todosUsuarios: false,
      papel: '',
      setorId: '',
      enviarEmail: true,
      prioridade: 'normal'
    }
  });

  useEffect(() => {
    loadNotificacoes();
    loadUsuarios();
  }, []);

  const loadNotificacoes = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - substitua pelas chamadas reais da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotificacoes = [
        {
          id: 1,
          titulo: 'Visita Aprovada',
          mensagem: 'Sua visita para o dia 08/08/2025 às 14:00 foi aprovada por Carlos Alberto Souza.',
          tipo: NOTIFICATION_TYPES.VISITA_APROVADA,
          remetente: {
            id: 1,
            nome: 'Carlos Alberto Souza',
            email: 'carlos.souza@seduc.ma.gov.br'
          },
          destinatario: {
            id: user?.id || 999,
            nome: user?.nome || 'Wesley Gatinho',
            email: user?.email || 'wesleygatinho@gmail.com'
          },
          lida: false,
          dataEnvio: '2025-08-07T15:30:00Z',
          dataLeitura: null,
          prioridade: 'alta',
          emailEnviado: true,
          expirarEm: '2025-08-15T23:59:59Z',
          dadosAdicionais: {
            visitaId: 1,
            protocolo: 'VIS-2025-001',
            dataVisita: '2025-08-08',
            horaVisita: '14:00'
          }
        },
        {
          id: 2,
          titulo: 'Lembrete de Reunião',
          mensagem: 'Reunião mensal de diretoria hoje às 09:00 no Gabinete.',
          tipo: NOTIFICATION_TYPES.REUNIAO,
          remetente: {
            id: 2,
            nome: 'Sistema SISREC',
            email: 'sistema@seduc.ma.gov.br'
          },
          destinatario: {
            id: user?.id || 999,
            nome: user?.nome || 'Wesley Gatinho',
            email: user?.email || 'wesleygatinho@gmail.com'
          },
          lida: true,
          dataEnvio: '2025-08-08T06:00:00Z',
          dataLeitura: '2025-08-08T07:15:00Z',
          prioridade: 'alta',
          emailEnviado: true,
          expirarEm: '2025-08-08T23:59:59Z',
          dadosAdicionais: {
            reuniaoId: 15,
            local: 'Gabinete - Sala 501'
          }
        },
        {
          id: 3,
          titulo: 'Manutenção Programada',
          mensagem: 'Sistema ficará indisponível no sábado das 06:00 às 08:00 para manutenção preventiva.',
          tipo: NOTIFICATION_TYPES.MANUTENCAO,
          remetente: {
            id: 1,
            nome: 'Equipe de TI',
            email: 'ti@seduc.ma.gov.br'
          },
          destinatario: {
            id: user?.id || 999,
            nome: user?.nome || 'Wesley Gatinho',
            email: user?.email || 'wesleygatinho@gmail.com'
          },
          lida: false,
          dataEnvio: '2025-08-06T10:00:00Z',
          dataLeitura: null,
          prioridade: 'normal',
          emailEnviado: true,
          expirarEm: '2025-08-10T23:59:59Z',
          dadosAdicionais: {
            manutencaoId: 5,
            duracao: '2 horas'
          }
        },
        {
          id: 4,
          titulo: 'Nova Visita Agendada',
          mensagem: 'João Silva Santos agendou uma visita para você no dia 09/08/2025 às 15:30.',
          tipo: NOTIFICATION_TYPES.VISITA_AGENDADA,
          remetente: {
            id: 3,
            nome: 'João Silva Santos',
            email: 'joao.silva@empresa.com'
          },
          destinatario: {
            id: user?.id || 999,
            nome: user?.nome || 'Wesley Gatinho',
            email: user?.email || 'wesleygatinho@gmail.com'
          },
          lida: true,
          dataEnvio: '2025-08-07T16:45:00Z',
          dataLeitura: '2025-08-07T18:20:00Z',
          prioridade: 'normal',
          emailEnviado: true,
          expirarEm: '2025-08-09T23:59:59Z',
          dadosAdicionais: {
            visitaId: 5,
            protocolo: 'VIS-2025-005',
            dataVisita: '2025-08-09',
            horaVisita: '15:30'
          }
        },
        {
          id: 5,
          titulo: 'Parabéns! É seu aniversário!',
          mensagem: 'A equipe SEDUC/MA deseja um feliz aniversário! 🎉',
          tipo: NOTIFICATION_TYPES.ANIVERSARIO,
          remetente: {
            id: 2,
            nome: 'Sistema SISREC',
            email: 'sistema@seduc.ma.gov.br'
          },
          destinatario: {
            id: user?.id || 999,
            nome: user?.nome || 'Wesley Gatinho',
            email: user?.email || 'wesleygatinho@gmail.com'
          },
          lida: false,
          dataEnvio: '2025-08-08T00:01:00Z',
          dataLeitura: null,
          prioridade: 'baixa',
          emailEnviado: false,
          expirarEm: '2025-08-08T23:59:59Z',
          dadosAdicionais: {
            dataNascimento: '1990-08-08'
          }
        }
      ];

      // Se for admin, adicionar notificações enviadas
      if (isAdmin()) {
        const notificacoesEnviadas = [
          {
            id: 6,
            titulo: 'Comunicado Geral',
            mensagem: 'Novo protocolo de segurança implementado a partir de segunda-feira.',
            tipo: NOTIFICATION_TYPES.SISTEMA,
            remetente: {
              id: user?.id || 999,
              nome: user?.nome || 'Wesley Gatinho',
              email: user?.email || 'wesleygatinho@gmail.com'
            },
            destinatario: null, // Notificação em massa
            totalDestinatarios: 45,
            lida: null,
            dataEnvio: '2025-08-05T14:00:00Z',
            dataLeitura: null,
            prioridade: 'alta',
            emailEnviado: true,
            expirarEm: '2025-08-12T23:59:59Z',
            status: 'enviada',
            dadosAdicionais: {
              destinatarios: ['todos'],
              totalLidas: 32,
              totalNaoLidas: 13
            }
          }
        ];
        
        mockNotificacoes.push(...notificacoesEnviadas);
      }

      setNotificacoes(mockNotificacoes);
      
    } catch (error) {
      toast.error('Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      // Mock de usuários para seleção
      const mockUsuarios = [
        { id: 1, nome: 'Carlos Alberto Souza', email: 'carlos.souza@seduc.ma.gov.br', papel: ROLES.ADMIN },
        { id: 2, nome: 'Maria Fernanda Lima', email: 'maria.lima@seduc.ma.gov.br', papel: ROLES.RECEPCIONISTA },
        { id: 3, nome: 'João Pedro Santos', email: 'joao.santos@seduc.ma.gov.br', papel: ROLES.SERVIDOR },
        { id: 4, nome: 'Ana Paula Costa', email: 'ana.costa@seduc.ma.gov.br', papel: ROLES.SERVIDOR }
      ];
      
      setUsuarios(mockUsuarios);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleOpenModal = (notificacao = null) => {
    setEditingNotificacao(notificacao);
    if (notificacao) {
      setValue('titulo', notificacao.titulo);
      setValue('mensagem', notificacao.mensagem);
      setValue('tipo', notificacao.tipo);
      setValue('prioridade', notificacao.prioridade);
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotificacao(null);
    reset();
  };

  const handleShowDetails = (notificacao) => {
    setSelectedNotificacao(notificacao);
    setShowDetailsModal(true);
    
    // Marcar como lida se não foi lida ainda
    if (!notificacao.lida && notificacao.destinatario?.id === user?.id) {
      marcarComoLida(notificacao.id);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingNotificacao) {
        toast.success('Notificação atualizada com sucesso!');
      } else {
        toast.success('Notificação enviada com sucesso!');
      }
      handleCloseModal();
      loadNotificacoes();
    } catch (error) {
      toast.error('Erro ao enviar notificação');
    }
  };

  const onSubmitBulk = async (data) => {
    try {
      toast.success(`Notificação enviada para ${data.todosUsuarios ? 'todos os usuários' : 'usuários selecionados'}!`);
      setShowBulkModal(false);
      bulkForm.reset();
      loadNotificacoes();
    } catch (error) {
      toast.error('Erro ao enviar notificação em massa');
    }
  };

  const marcarComoLida = async (id) => {
    try {
      // Chamada para API
      const updatedNotificacoes = notificacoes.map(n => 
        n.id === id ? { ...n, lida: true, dataLeitura: new Date().toISOString() } : n
      );
      setNotificacoes(updatedNotificacoes);
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const updatedNotificacoes = notificacoes.map(n => 
        n.destinatario?.id === user?.id && !n.lida ? 
        { ...n, lida: true, dataLeitura: new Date().toISOString() } : n
      );
      setNotificacoes(updatedNotificacoes);
      toast.success('Todas as notificações foram marcadas como lidas!');
    } catch (error) {
      toast.error('Erro ao marcar notificações como lidas');
    }
  };

  const handleDeleteNotificacao = (notificacao) => {
    setNotificacaoToDelete(notificacao);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      toast.success('Notificação excluída com sucesso!');
      setShowDeleteModal(false);
      setNotificacaoToDelete(null);
      loadNotificacoes();
    } catch (error) {
      toast.error('Erro ao excluir notificação');
    }
  };

  // Filtrar notificações
  const getFilteredNotificacoes = () => {
    let filtered = notificacoes;

    // Filtro por aba
    if (activeTab === 'recebidas') {
      filtered = filtered.filter(n => n.destinatario?.id === user?.id);
    } else if (activeTab === 'enviadas') {
      filtered = filtered.filter(n => n.remetente?.id === user?.id);
    } else if (activeTab === 'nao-lidas') {
      filtered = filtered.filter(n => n.destinatario?.id === user?.id && !n.lida);
    }

    // Filtros adicionais
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.remetente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTipo !== 'all') {
      filtered = filtered.filter(n => n.tipo === filterTipo);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(n => {
        if (filterStatus === 'lidas') return n.lida;
        if (filterStatus === 'nao-lidas') return !n.lida;
        return true;
      });
    }

    if (filterData) {
      filtered = filtered.filter(n => 
        n.dataEnvio.startsWith(filterData)
      );
    }

    return filtered.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
  };

  const filteredNotificacoes = getFilteredNotificacoes();

  const getNotificationTypeLabel = (tipo) => {
    const labels = {
      [NOTIFICATION_TYPES.VISITA_AGENDADA]: 'Visita Agendada',
      [NOTIFICATION_TYPES.VISITA_APROVADA]: 'Visita Aprovada',
      [NOTIFICATION_TYPES.VISITA_REJEITADA]: 'Visita Rejeitada',
      [NOTIFICATION_TYPES.VISITA_CANCELADA]: 'Visita Cancelada',
      [NOTIFICATION_TYPES.LEMBRETE_VISITA]: 'Lembrete de Visita',
      [NOTIFICATION_TYPES.SISTEMA]: 'Sistema',
      [NOTIFICATION_TYPES.MANUTENCAO]: 'Manutenção',
      [NOTIFICATION_TYPES.ANIVERSARIO]: 'Aniversário',
      [NOTIFICATION_TYPES.REUNIAO]: 'Reunião'
    };
    return labels[tipo] || tipo;
  };

  const getPriorityBadge = (prioridade) => {
    const variants = {
      'baixa': 'secondary',
      'normal': 'info', 
      'alta': 'warning',
      'critica': 'danger'
    };
    
    const labels = {
      'baixa': 'Baixa',
      'normal': 'Normal',
      'alta': 'Alta',
      'critica': 'Crítica'
    };
    
    return <Badge bg={variants[prioridade] || 'info'}>{labels[prioridade] || prioridade}</Badge>;
  };

  const getTypeBadge = (tipo) => {
    const variants = {
      [NOTIFICATION_TYPES.VISITA_AGENDADA]: 'primary',
      [NOTIFICATION_TYPES.VISITA_APROVADA]: 'success',
      [NOTIFICATION_TYPES.VISITA_REJEITADA]: 'danger',
      [NOTIFICATION_TYPES.VISITA_CANCELADA]: 'warning',
      [NOTIFICATION_TYPES.LEMBRETE_VISITA]: 'info',
      [NOTIFICATION_TYPES.SISTEMA]: 'dark',
      [NOTIFICATION_TYPES.MANUTENCAO]: 'warning',
      [NOTIFICATION_TYPES.ANIVERSARIO]: 'success',
      [NOTIFICATION_TYPES.REUNIAO]: 'primary'
    };
    
    return <Badge bg={variants[tipo] || 'secondary'}>{getNotificationTypeLabel(tipo)}</Badge>;
  };

  const getUnreadCount = () => {
    return notificacoes.filter(n => n.destinatario?.id === user?.id && !n.lida).length;
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando notificações..." />;
  }

  return (
    <div className="notifications-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Notificações</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-bell me-3"></i>
                Central de Notificações
                {getUnreadCount() > 0 && (
                  <Badge bg="danger" className="ms-2">
                    {getUnreadCount()}
                  </Badge>
                )}
              </h1>
              <p className="text-muted">
                Gerencie suas notificações e comunicados do sistema
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                {getUnreadCount() > 0 && (
                  <Button 
                    variant="outline-primary" 
                    onClick={marcarTodasComoLidas}
                  >
                    <i className="fas fa-check-double me-2"></i>
                    Marcar Todas como Lidas
                  </Button>
                )}
                {canManageNotifications() && (
                  <Dropdown>
                    <Dropdown.Toggle variant="primary">
                      <i className="fas fa-plus me-2"></i>
                      Nova Notificação
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleOpenModal()}>
                        <i className="fas fa-user me-2"></i>
                        Notificação Individual
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setShowBulkModal(true)}>
                        <i className="fas fa-users me-2"></i>
                        Notificação em Massa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-bell"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{notificacoes.filter(n => n.destinatario?.id === user?.id).length}</h3>
                    <p className="stat-label">Total Recebidas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-exclamation"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{getUnreadCount()}</h3>
                    <p className="stat-label">Não Lidas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-success">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{notificacoes.filter(n => n.destinatario?.id === user?.id && n.lida).length}</h3>
                    <p className="stat-label">Lidas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-paper-plane"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{notificacoes.filter(n => n.remetente?.id === user?.id).length}</h3>
                    <p className="stat-label">Enviadas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs e Filtros */}
        <Card>
          <Card.Header className="p-0">
            <Tabs 
              activeKey={activeTab} 
              onSelect={setActiveTab}
              className="nav-tabs-custom"
            >
              <Tab eventKey="recebidas" title={
                <>
                  <i className="fas fa-inbox me-2"></i>
                  Recebidas
                  {getUnreadCount() > 0 && (
                    <Badge bg="danger" className="ms-1">{getUnreadCount()}</Badge>
                  )}
                </>
              } />
              <Tab eventKey="nao-lidas" title={<><i className="fas fa-envelope me-2"></i>Não Lidas</>} />
              {canManageNotifications() && (
                <Tab eventKey="enviadas" title={<><i className="fas fa-paper-plane me-2"></i>Enviadas</>} />
              )}
            </Tabs>
          </Card.Header>
          
          <Card.Body className="p-0">
            {/* Filtros */}
            <div className="p-3 border-bottom">
              <Row className="align-items-end">
                <Col md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Buscar</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Título, mensagem, remetente..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      value={filterTipo}
                      onChange={e => setFilterTipo(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {getNotificationTypeLabel(value)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      <option value="lidas">Lidas</option>
                      <option value="nao-lidas">Não Lidas</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      type="date"
                      value={filterData}
                      onChange={e => setFilterData(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Button variant="outline-secondary" onClick={loadNotificacoes}>
                    <i className="fas fa-refresh me-2"></i>
                    Atualizar
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Lista de Notificações */}
            <div className="notifications-list">
              {filteredNotificacoes.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Nenhuma notificação encontrada</p>
                </div>
              ) : (
                filteredNotificacoes.map(notificacao => (
                  <NotificationCard
                    key={notificacao.id}
                    notification={notificacao}
                    onClick={() => handleShowDetails(notificacao)}
                    onMarkAsRead={() => marcarComoLida(notificacao.id)}
                    onDelete={() => handleDeleteNotificacao(notificacao)}
                    canDelete={canManageNotifications() || notificacao.destinatario?.id === user?.id}
                  />
                ))
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal de Nova Notificação Individual */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-bell me-2"></i>
              {editingNotificacao ? 'Editar Notificação' : 'Nova Notificação'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Título da notificação"
                      {...register('titulo')}
                      isInvalid={!!errors.titulo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.titulo?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      {...register('tipo')}
                      isInvalid={!!errors.tipo}
                    >
                      {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {getNotificationTypeLabel(value)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Mensagem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Conteúdo da notificação"
                  {...register('mensagem')}
                  isInvalid={!!errors.mensagem}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mensagem?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Destinatários</Form.Label>
                <Form.Select
                  multiple
                  {...register('destinatarios')}
                  isInvalid={!!errors.destinatarios}
                  size={5}
                >
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome} ({usuario.email})
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Mantenha Ctrl pressionado para selecionar múltiplos usuários
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Prioridade</Form.Label>
                    <Form.Select {...register('prioridade')}>
                      <option value="baixa">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Envio</Form.Label>
                    <Form.Control
                      type="date"
                      {...register('dataEnvio')}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Form.Text className="text-muted">
                      Deixe vazio para enviar agora
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora de Envio</Form.Label>
                    <Form.Control
                      type="time"
                      {...register('horaEnvio')}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Expira em</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('expirarEm')}
                />
                <Form.Text className="text-muted">
                  Data e hora em que a notificação expira automaticamente
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="switch"
                  id="enviar-email"
                  label="Enviar também por email"
                  {...register('enviarEmail')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-paper-plane me-2"></i>
                {editingNotificacao ? 'Atualizar' : 'Enviar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Notificação em Massa */}
        <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-users me-2"></i>
              Notificação em Massa
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={bulkForm.handleSubmit(onSubmitBulk)} noValidate>
            <Modal.Body>
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                Esta notificação será enviada para múltiplos usuários simultaneamente.
              </Alert>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Título da notificação"
                      {...bulkForm.register('titulo')}
                      isInvalid={!!bulkForm.formState.errors.titulo}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select {...bulkForm.register('tipo')}>
                      {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {getNotificationTypeLabel(value)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Mensagem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Conteúdo da notificação"
                  {...bulkForm.register('mensagem')}
                />
              </Form.Group>

              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Destinatários</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="todos-usuarios"
                      label="Enviar para todos os usuários"
                      {...bulkForm.register('todosUsuarios')}
                    />
                  </Form.Group>

                  {!bulkForm.watch('todosUsuarios') && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Filtrar por Papel</Form.Label>
                          <Form.Select {...bulkForm.register('papel')}>
                            <option value="">Todos os papéis</option>
                            <option value={ROLES.ADMIN}>Administradores</option>
                            <option value={ROLES.RECEPCIONISTA}>Recepcionistas</option>
                            <option value={ROLES.SERVIDOR}>Servidores</option>
                            <option value={ROLES.VISITANTE}>Visitantes</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Filtrar por Setor</Form.Label>
                          <Form.Select {...bulkForm.register('setorId')}>
                            <option value="">Todos os setores</option>
                            <option value="1">Gabinete</option>
                            <option value="2">Recursos Humanos</option>
                            <option value="3">Financeiro</option>
                            <option value="4">Tecnologia da Informação</option>
                            <option value="5">Planejamento</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Prioridade</Form.Label>
                    <Form.Select {...bulkForm.register('prioridade')}>
                      <option value="baixa">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 d-flex align-items-end">
                    <Form.Check
                      type="switch"
                      id="enviar-email-bulk"
                      label="Enviar também por email"
                      {...bulkForm.register('enviarEmail')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-paper-plane me-2"></i>
                Enviar para Todos
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Detalhes */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-info-circle me-2"></i>
              Detalhes da Notificação
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNotificacao && (
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5>{selectedNotificacao.titulo}</h5>
                    <div className="d-flex gap-2 mb-2">
                      {getTypeBadge(selectedNotificacao.tipo)}
                      {getPriorityBadge(selectedNotificacao.prioridade)}
                      {selectedNotificacao.lida ? (
                        <Badge bg="success">Lida</Badge>
                      ) : (
                        <Badge bg="warning">Não Lida</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="notification-content mb-4">
                  <p>{selectedNotificacao.mensagem}</p>
                </div>

                <Row>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Informações de Envio</h6>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Remetente:</strong> {selectedNotificacao.remetente.nome}</p>
                        <p><strong>Data de Envio:</strong> {formatDateTime(selectedNotificacao.dataEnvio)}</p>
                        <p><strong>Email Enviado:</strong> {selectedNotificacao.emailEnviado ? 'Sim' : 'Não'}</p>
                        {selectedNotificacao.expirarEm && (
                          <p><strong>Expira em:</strong> {formatDateTime(selectedNotificacao.expirarEm)}</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Status de Leitura</h6>
                      </Card.Header>
                      <Card.Body>
                        {selectedNotificacao.destinatario ? (
                          <>
                            <p><strong>Destinatário:</strong> {selectedNotificacao.destinatario.nome}</p>
                            <p><strong>Status:</strong> {selectedNotificacao.lida ? 'Lida' : 'Não Lida'}</p>
                            {selectedNotificacao.dataLeitura && (
                              <p><strong>Lida em:</strong> {formatDateTime(selectedNotificacao.dataLeitura)}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <p><strong>Tipo:</strong> Notificação em massa</p>
                            <p><strong>Total Destinatários:</strong> {selectedNotificacao.totalDestinatarios}</p>
                            {selectedNotificacao.dadosAdicionais?.totalLidas !== undefined && (
                              <>
                                <p><strong>Lidas:</strong> {selectedNotificacao.dadosAdicionais.totalLidas}</p>
                                <p><strong>Não Lidas:</strong> {selectedNotificacao.dadosAdicionais.totalNaoLidas}</p>
                              </>
                            )}
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {selectedNotificacao.dadosAdicionais && (
                  <Card className="mt-3">
                    <Card.Header>
                      <h6 className="mb-0">Dados Adicionais</h6>
                    </Card.Header>
                    <Card.Body>
                      <pre className="text-muted small">
                        {JSON.stringify(selectedNotificacao.dadosAdicionais, null, 2)}
                      </pre>
                    </Card.Body>
                  </Card>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedNotificacao && !selectedNotificacao.lida && selectedNotificacao.destinatario?.id === user?.id && (
              <Button variant="primary" onClick={() => marcarComoLida(selectedNotificacao.id)}>
                <i className="fas fa-check me-2"></i>
                Marcar como Lida
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a notificação "${notificacaoToDelete?.titulo}"? Esta ação não pode ser desfeita.`}
          variant="danger"
        />
      </Container>
    </div>
  );
};

export default NotificationsPage;