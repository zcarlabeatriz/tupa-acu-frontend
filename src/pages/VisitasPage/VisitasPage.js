import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// import { visitasService } from '../../services/api/visitasService';
import { visitaSchema } from '../../services/utils/validators';
import { formatPhone, formatCPF, formatDate, formatDateTime } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, VISIT_STATUS } from '../../services/utils/constants';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import './VisitasPage.css';

const VisitasPage = () => {
  const [visitas, setVisitas] = useState([]);
  const [servidores, setServidores] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingVisita, setEditingVisita] = useState(null);
  const [selectedVisita, setSelectedVisita] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSetor, setFilterSetor] = useState('all');
  const [filterData, setFilterData] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionVisita, setActionVisita] = useState(null);
  const [actionType, setActionType] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  
  const { user } = useAuth();
  const { canManageVisitas, canApproveVisitas, isVisitante } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(visitaSchema),
    defaultValues: {
      visitanteNome: '',
      visitanteEmail: '',
      visitanteCpf: '',
      visitanteCelular: '',
      visitanteEmpresa: '',
      servidorId: '',
      dataVisita: '',
      horaInicio: '',
      horaFim: '',
      motivo: '',
      observacoes: ''
    }
  });

  // Formatação automática dos campos
  const visitanteCelularValue = watch('visitanteCelular');
  const visitanteCpfValue = watch('visitanteCpf');
  
  useEffect(() => {
    if (visitanteCelularValue) {
      const formatted = formatPhone(visitanteCelularValue);
      if (formatted !== visitanteCelularValue) {
        setValue('visitanteCelular', formatted);
      }
    }
  }, [visitanteCelularValue, setValue]);

  useEffect(() => {
    if (visitanteCpfValue) {
      const formatted = formatCPF(visitanteCpfValue);
      if (formatted !== visitanteCpfValue) {
        setValue('visitanteCpf', formatted);
      }
    }
  }, [visitanteCpfValue, setValue]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - substitua pelas chamadas reais da API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockSetores = [
        { id: 1, nome: 'Gabinete' },
        { id: 2, nome: 'Recursos Humanos' },
        { id: 3, nome: 'Financeiro' },
        { id: 4, nome: 'Tecnologia da Informação' },
        { id: 5, nome: 'Planejamento' }
      ];

      const mockServidores = [
        { id: 1, nome: 'Carlos Alberto Souza', setorId: 4, setor: 'Tecnologia da Informação' },
        { id: 2, nome: 'Maria Fernanda Lima', setorId: 1, setor: 'Gabinete' },
        { id: 3, nome: 'João Pedro Santos', setorId: 2, setor: 'Recursos Humanos' },
        { id: 4, nome: 'Ana Paula Costa', setorId: 3, setor: 'Financeiro' },
        { id: 5, nome: 'Rafael Mendes Silva', setorId: 5, setor: 'Planejamento' }
      ];

      const mockVisitas = [
        {
          id: 1,
          visitante: {
            nome: 'João Silva Santos',
            email: 'joao.silva@empresa.com',
            cpf: '123.456.789-01',
            celular: '(98) 98765-4321',
            empresa: 'TechCorp Ltda'
          },
          servidor: {
            id: 1,
            nome: 'Carlos Alberto Souza',
            setor: 'Tecnologia da Informação'
          },
          dataVisita: '2025-08-08',
          horaInicio: '14:00',
          horaFim: '15:30',
          motivo: 'Apresentação de proposta de sistema',
          observacoes: 'Reunião sobre implementação de novo sistema de gestão',
          status: VISIT_STATUS.APROVADA,
          dataSolicitacao: '2025-08-07T10:30:00Z',
          dataAprovacao: '2025-08-07T11:15:00Z',
          aprovadoPor: 'Carlos Alberto Souza',
          protocolo: 'VIS-2025-001'
        },
        {
          id: 2,
          visitante: {
            nome: 'Maria Oliveira Costa',
            email: 'maria.oliveira@consultoria.com',
            cpf: '987.654.321-09',
            celular: '(98) 99876-5432',
            empresa: 'Consultoria Educacional'
          },
          servidor: {
            id: 2,
            nome: 'Maria Fernanda Lima',
            setor: 'Gabinete'
          },
          dataVisita: '2025-08-09',
          horaInicio: '09:00',
          horaFim: '11:00',
          motivo: 'Consultoria em gestão educacional',
          observacoes: '',
          status: VISIT_STATUS.PENDENTE,
          dataSolicitacao: '2025-08-07T15:20:00Z',
          dataAprovacao: null,
          aprovadoPor: null,
          protocolo: 'VIS-2025-002'
        },
        {
          id: 3,
          visitante: {
            nome: 'Pedro Henrique Alves',
            email: 'pedro.alves@fornecedor.com',
            cpf: '456.789.123-45',
            celular: '(98) 97654-3210',
            empresa: 'Fornecedora de Material'
          },
          servidor: {
            id: 4,
            nome: 'Ana Paula Costa',
            setor: 'Financeiro'
          },
          dataVisita: '2025-08-07',
          horaInicio: '16:00',
          horaFim: '17:00',
          motivo: 'Negociação de contratos',
          observacoes: 'Visitante não compareceu no horário agendado',
          status: VISIT_STATUS.REJEITADA,
          dataSolicitacao: '2025-08-06T14:00:00Z',
          dataAprovacao: '2025-08-07T08:30:00Z',
          aprovadoPor: 'Ana Paula Costa',
          protocolo: 'VIS-2025-003'
        },
        {
          id: 4,
          visitante: {
            nome: 'Luiza Santos Ferreira',
            email: 'luiza.ferreira@contabilidade.com',
            cpf: '789.123.456-78',
            celular: '(98) 96543-2109',
            empresa: 'Escritório Contábil'
          },
          servidor: {
            id: 3,
            nome: 'João Pedro Santos',
            setor: 'Recursos Humanos'
          },
          dataVisita: '2025-08-10',
          horaInicio: '10:00',
          horaFim: '12:00',
          motivo: 'Auditoria de folha de pagamento',
          observacoes: 'Necessário apresentar documentos específicos',
          status: VISIT_STATUS.CONCLUIDA,
          dataSolicitacao: '2025-08-05T09:00:00Z',
          dataAprovacao: '2025-08-05T10:30:00Z',
          aprovadoPor: 'João Pedro Santos',
          protocolo: 'VIS-2025-004',
          dataCheckIn: '2025-08-07T10:05:00Z',
          dataCheckOut: '2025-08-07T11:58:00Z'
        }
      ];

      setSetores(mockSetores);
      setServidores(mockServidores);
      setVisitas(mockVisitas);
      
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (visita = null) => {
    setEditingVisita(visita);
    if (visita) {
      setValue('visitanteNome', visita.visitante.nome);
      setValue('visitanteEmail', visita.visitante.email);
      setValue('visitanteCpf', visita.visitante.cpf);
      setValue('visitanteCelular', visita.visitante.celular);
      setValue('visitanteEmpresa', visita.visitante.empresa || '');
      setValue('servidorId', visita.servidor.id);
      setValue('dataVisita', visita.dataVisita);
      setValue('horaInicio', visita.horaInicio);
      setValue('horaFim', visita.horaFim);
      setValue('motivo', visita.motivo);
      setValue('observacoes', visita.observacoes || '');
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVisita(null);
    reset();
  };

  const handleShowDetails = (visita) => {
    setSelectedVisita(visita);
    setShowDetailsModal(true);
  };

  const handleAction = (visita, action) => {
    setActionVisita(visita);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    try {
      let message = '';
      switch (actionType) {
        case 'approve':
          message = 'Visita aprovada com sucesso!';
          break;
        case 'reject':
          message = 'Visita rejeitada com sucesso!';
          break;
        case 'cancel':
          message = 'Visita cancelada com sucesso!';
          break;
        case 'checkin':
          message = 'Check-in realizado com sucesso!';
          break;
        case 'checkout':
          message = 'Check-out realizado com sucesso!';
          break;
        default:
          message = 'Ação realizada com sucesso!';
      }
      
      toast.success(message);
      setShowActionModal(false);
      setActionVisita(null);
      setActionType('');
      loadData();
    } catch (error) {
      toast.error('Erro ao executar ação');
    }
  };

  const onSubmit = async (data) => {
    try {
      const visitaData = {
        ...data,
        visitanteCpf: data.visitanteCpf.replace(/\D/g, ''),
        visitanteCelular: data.visitanteCelular.replace(/\D/g, '')
      };

      if (editingVisita) {
        toast.success('Visita atualizada com sucesso!');
      } else {
        toast.success('Visita agendada com sucesso! Aguarde aprovação.');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar visita');
    }
  };

  // Filtrar visitas
  const filteredVisitas = visitas.filter(visita => {
    const matchesSearch = visita.visitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.visitante.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.protocolo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visita.status === filterStatus;
    const matchesSetor = filterSetor === 'all' || visita.servidor.setor === filterSetor;
    const matchesData = !filterData || visita.dataVisita === filterData;
    
    // Filtro por aba
    let matchesTab = true;
    switch (activeTab) {
      case 'pendentes':
        matchesTab = visita.status === VISIT_STATUS.PENDENTE;
        break;
      case 'aprovadas':
        matchesTab = visita.status === VISIT_STATUS.APROVADA;
        break;
      case 'minhas':
        matchesTab = user?.papel === ROLES.SERVIDOR ? 
          visita.servidor.nome === user.nome : 
          visita.visitante.email === user.email;
        break;
      default:
        matchesTab = true;
    }
    
    return matchesSearch && matchesStatus && matchesSetor && matchesData && matchesTab;
  });

  const getStatusBadge = (status) => {
    const variants = {
      [VISIT_STATUS.PENDENTE]: { bg: 'warning', text: 'Pendente' },
      [VISIT_STATUS.APROVADA]: { bg: 'success', text: 'Aprovada' },
      [VISIT_STATUS.REJEITADA]: { bg: 'danger', text: 'Rejeitada' },
      [VISIT_STATUS.CONCLUIDA]: { bg: 'info', text: 'Concluída' },
      [VISIT_STATUS.CANCELADA]: { bg: 'secondary', text: 'Cancelada' }
    };
    
    const config = variants[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getActionMessage = () => {
    const messages = {
      approve: `Deseja aprovar a visita de "${actionVisita?.visitante.nome}"?`,
      reject: `Deseja rejeitar a visita de "${actionVisita?.visitante.nome}"?`,
      cancel: `Deseja cancelar a visita de "${actionVisita?.visitante.nome}"?`,
      checkin: `Confirmar check-in de "${actionVisita?.visitante.nome}"?`,
      checkout: `Confirmar check-out de "${actionVisita?.visitante.nome}"?`
    };
    return messages[actionType] || 'Confirmar ação?';
  };

  const getActionTitle = () => {
    const titles = {
      approve: 'Aprovar Visita',
      reject: 'Rejeitar Visita',
      cancel: 'Cancelar Visita',
      checkin: 'Check-in',
      checkout: 'Check-out'
    };
    return titles[actionType] || 'Confirmar Ação';
  };

  const canPerformAction = (visita, action) => {
    switch (action) {
      case 'approve':
      case 'reject':
        return canApproveVisitas() && visita.status === VISIT_STATUS.PENDENTE;
      case 'cancel':
        return canManageVisitas() && [VISIT_STATUS.PENDENTE, VISIT_STATUS.APROVADA].includes(visita.status);
      case 'checkin':
        return canApproveVisitas() && visita.status === VISIT_STATUS.APROVADA;
      case 'checkout':
        return canApproveVisitas() && visita.status === VISIT_STATUS.APROVADA;
      default:
        return false;
    }
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando visitas..." />;
  }

  return (
    <div className="visitas-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Visitas</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-calendar-alt me-3"></i>
                Gerenciar Visitas
              </h1>
              <p className="text-muted">
                Agendamento e controle de visitas na SEDUC/MA
              </p>
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <i className="fas fa-plus me-2"></i>
                Agendar Visita
              </Button>
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-calendar-day"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{visitas.length}</h3>
                    <p className="stat-label">Total Visitas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-clock"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{visitas.filter(v => v.status === VISIT_STATUS.PENDENTE).length}</h3>
                    <p className="stat-label">Pendentes</p>
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
                    <h3 className="stat-number">{visitas.filter(v => v.status === VISIT_STATUS.APROVADA).length}</h3>
                    <p className="stat-label">Aprovadas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-check-double"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{visitas.filter(v => v.status === VISIT_STATUS.CONCLUIDA).length}</h3>
                    <p className="stat-label">Concluídas</p>
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
              <Tab eventKey="todas" title={<><i className="fas fa-list me-2"></i>Todas</>} />
              <Tab eventKey="pendentes" title={<><i className="fas fa-clock me-2"></i>Pendentes</>} />
              <Tab eventKey="aprovadas" title={<><i className="fas fa-check me-2"></i>Aprovadas</>} />
              {(user?.papel === ROLES.SERVIDOR || isVisitante()) && (
                <Tab eventKey="minhas" title={<><i className="fas fa-user me-2"></i>Minhas</>} />
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
                        placeholder="Visitante, servidor, protocolo..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6} lg={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      <option value={VISIT_STATUS.PENDENTE}>Pendente</option>
                      <option value={VISIT_STATUS.APROVADA}>Aprovada</option>
                      <option value={VISIT_STATUS.REJEITADA}>Rejeitada</option>
                      <option value={VISIT_STATUS.CONCLUIDA}>Concluída</option>
                      <option value={VISIT_STATUS.CANCELADA}>Cancelada</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} lg={2}>
                  <Form.Group>
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      value={filterSetor}
                      onChange={e => setFilterSetor(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.nome}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} lg={2}>
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
                  <Button variant="outline-secondary" onClick={loadData}>
                    <i className="fas fa-refresh me-2"></i>
                    Atualizar
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Tabela */}
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Protocolo</th>
                    <th>Visitante</th>
                    <th>Servidor/Setor</th>
                    <th>Data/Horário</th>
                    <th>Motivo</th>
                    <th>Status</th>
                    <th width="150">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitas.map(visita => (
                    <tr key={visita.id}>
                      <td>
                        <div className="fw-bold font-monospace text-primary">
                          {visita.protocolo}
                        </div>
                        <div className="text-muted small">
                          {formatDate(visita.dataSolicitacao)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="visitante-avatar me-3">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{visita.visitante.nome}</div>
                            <div className="text-muted small">{visita.visitante.empresa}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{visita.servidor.nome}</div>
                        <div className="text-muted small">{visita.servidor.setor}</div>
                      </td>
                      <td>
                        <div className="fw-bold">{formatDate(visita.dataVisita)}</div>
                        <div className="text-muted small">
                          {visita.horaInicio} - {visita.horaFim}
                        </div>
                      </td>
                      <td>
                        <div className="motivo-text">
                          {visita.motivo.length > 50 ? 
                            `${visita.motivo.substring(0, 50)}...` : 
                            visita.motivo
                          }
                        </div>
                      </td>
                      <td>{getStatusBadge(visita.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleShowDetails(visita)}
                            title="Ver detalhes"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          
                          {canPerformAction(visita, 'approve') && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleAction(visita, 'approve')}
                              title="Aprovar"
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                          )}
                          
                          {canPerformAction(visita, 'reject') && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleAction(visita, 'reject')}
                              title="Rejeitar"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          )}
                          
                          {canPerformAction(visita, 'checkin') && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleAction(visita, 'checkin')}
                              title="Check-in"
                            >
                              <i className="fas fa-sign-in-alt"></i>
                            </Button>
                          )}
                          
                          {canPerformAction(visita, 'checkout') && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleAction(visita, 'checkout')}
                              title="Check-out"
                            >
                              <i className="fas fa-sign-out-alt"></i>
                            </Button>
                          )}
                          
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleOpenModal(visita)}>
                                <i className="fas fa-edit me-2"></i>
                                Editar
                              </Dropdown.Item>
                              {canPerformAction(visita, 'cancel') && (
                                <Dropdown.Item 
                                  className="text-danger" 
                                  onClick={() => handleAction(visita, 'cancel')}
                                >
                                  <i className="fas fa-ban me-2"></i>
                                  Cancelar
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredVisitas.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Nenhuma visita encontrada</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal de Agendamento/Edição */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-calendar-plus me-2"></i>
              {editingVisita ? 'Editar Visita' : 'Agendar Visita'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Modal.Body>
              <Alert variant="info" className="mb-4">
                <i className="fas fa-info-circle me-2"></i>
                Após o agendamento, a visita precisará ser aprovada pelo servidor responsável.
              </Alert>
              
              <h6 className="mb-3 text-primary">
                <i className="fas fa-user me-2"></i>
                Dados do Visitante
              </h6>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome do visitante"
                      {...register('visitanteNome')}
                      isInvalid={!!errors.visitanteNome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.visitanteNome?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@exemplo.com"
                      {...register('visitanteEmail')}
                      isInvalid={!!errors.visitanteEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.visitanteEmail?.message}
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
                      {...register('visitanteCpf')}
                      isInvalid={!!errors.visitanteCpf}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.visitanteCpf?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Celular</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="(99) 99999-9999"
                      {...register('visitanteCelular')}
                      isInvalid={!!errors.visitanteCelular}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.visitanteCelular?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label>Empresa/Instituição</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome da empresa ou instituição"
                  {...register('visitanteEmpresa')}
                  isInvalid={!!errors.visitanteEmpresa}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.visitanteEmpresa?.message}
                </Form.Control.Feedback>
              </Form.Group>
              
              <h6 className="mb-3 text-primary">
                <i className="fas fa-calendar me-2"></i>
                Dados da Visita
              </h6>
              
              <Form.Group className="mb-3">
                <Form.Label>Servidor a Visitar</Form.Label>
                <Form.Select
                  {...register('servidorId')}
                  isInvalid={!!errors.servidorId}
                >
                  <option value="">Selecione um servidor</option>
                  {servidores.map(servidor => (
                    <option key={servidor.id} value={servidor.id}>
                      {servidor.nome} - {servidor.setor}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.servidorId?.message}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data da Visita</Form.Label>
                    <Form.Control
                      type="date"
                      {...register('dataVisita')}
                      isInvalid={!!errors.dataVisita}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataVisita?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Início</Form.Label>
                    <Form.Control
                      type="time"
                      {...register('horaInicio')}
                      isInvalid={!!errors.horaInicio}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.horaInicio?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Fim</Form.Label>
                    <Form.Control
                      type="time"
                      {...register('horaFim')}
                      isInvalid={!!errors.horaFim}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.horaFim?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Motivo da Visita</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descreva o motivo da visita"
                  {...register('motivo')}
                  isInvalid={!!errors.motivo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.motivo?.message}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Informações adicionais..."
                  {...register('observacoes')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-save me-2"></i>
                {editingVisita ? 'Atualizar' : 'Agendar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Detalhes */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-info-circle me-2"></i>
              Detalhes da Visita
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedVisita && (
              <Row>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <h6 className="mb-0">
                        <i className="fas fa-user me-2"></i>
                        Dados do Visitante
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Nome:</strong> {selectedVisita.visitante.nome}</p>
                      <p><strong>Email:</strong> {selectedVisita.visitante.email}</p>
                      <p><strong>CPF:</strong> {selectedVisita.visitante.cpf}</p>
                      <p><strong>Celular:</strong> {selectedVisita.visitante.celular}</p>
                      <p><strong>Empresa:</strong> {selectedVisita.visitante.empresa}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <h6 className="mb-0">
                        <i className="fas fa-calendar me-2"></i>
                        Dados da Visita
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Protocolo:</strong> {selectedVisita.protocolo}</p>
                      <p><strong>Servidor:</strong> {selectedVisita.servidor.nome}</p>
                      <p><strong>Setor:</strong> {selectedVisita.servidor.setor}</p>
                      <p><strong>Data:</strong> {formatDate(selectedVisita.dataVisita)}</p>
                      <p><strong>Horário:</strong> {selectedVisita.horaInicio} - {selectedVisita.horaFim}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedVisita.status)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} className="mt-3">
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">
                        <i className="fas fa-comment me-2"></i>
                        Motivo e Observações
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Motivo:</strong></p>
                      <p>{selectedVisita.motivo}</p>
                      {selectedVisita.observacoes && (
                        <>
                          <p><strong>Observações:</strong></p>
                          <p>{selectedVisita.observacoes}</p>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} className="mt-3">
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">
                        <i className="fas fa-history me-2"></i>
                        Histórico
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Solicitado em:</strong> {formatDateTime(selectedVisita.dataSolicitacao)}</p>
                      {selectedVisita.dataAprovacao && (
                        <p><strong>Aprovado em:</strong> {formatDateTime(selectedVisita.dataAprovacao)}</p>
                      )}
                      {selectedVisita.aprovadoPor && (
                        <p><strong>Aprovado por:</strong> {selectedVisita.aprovadoPor}</p>
                      )}
                      {selectedVisita.dataCheckIn && (
                        <p><strong>Check-in:</strong> {formatDateTime(selectedVisita.dataCheckIn)}</p>
                      )}
                      {selectedVisita.dataCheckOut && (
                        <p><strong>Check-out:</strong> {formatDateTime(selectedVisita.dataCheckOut)}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Confirmação de Ação */}
        <ConfirmModal
          show={showActionModal}
          onHide={() => setShowActionModal(false)}
          onConfirm={confirmAction}
          title={getActionTitle()}
          message={getActionMessage()}
          variant={actionType === 'approve' ? 'success' : actionType === 'reject' ? 'danger' : 'warning'}
          confirmText={actionType === 'approve' ? 'Aprovar' : actionType === 'reject' ? 'Rejeitar' : 'Confirmar'}
        />
      </Container>
    </div>
  );
};

export default VisitasPage;