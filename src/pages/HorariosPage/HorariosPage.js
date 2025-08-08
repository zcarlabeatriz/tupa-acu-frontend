import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// import { horariosService } from '../../services/api/horariosService';
import { horarioSchema, bloqueioSchema } from '../../services/utils/validators';
import { formatDate, formatDateTime, formatTime } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import CalendarioHorarios from '../../components/horarios/CalendarioHorarios/CalendarioHorarios';
import './HorariosPage.css';

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo', abrev: 'Dom' },
  { id: 1, nome: 'Segunda-feira', abrev: 'Seg' },
  { id: 2, nome: 'Terça-feira', abrev: 'Ter' },
  { id: 3, nome: 'Quarta-feira', abrev: 'Qua' },
  { id: 4, nome: 'Quinta-feira', abrev: 'Qui' },
  { id: 5, nome: 'Sexta-feira', abrev: 'Sex' },
  { id: 6, nome: 'Sábado', abrev: 'Sab' }
];

const HorariosPage = () => {
  const [configuracoes, setConfiguracoes] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showBloqueioModal, setShowBloqueioModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [editingBloqueio, setEditingBloqueio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSetor, setFilterSetor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [activeTab, setActiveTab] = useState('configuracoes');
  const [calendarioData, setCalendarioData] = useState([]);
  
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  // Form para configurações
  const configForm = useForm({
    resolver: yupResolver(horarioSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      setorId: '',
      diasSemana: [],
      horaInicio: '08:00',
      horaFim: '17:00',
      intervaloMinutos: 60,
      maxVisitasPorHorario: 1,
      antecedenciaMinima: 24,
      antecedenciaMaxima: 720,
      observacoes: '',
      ativo: true
    }
  });

  // Form para bloqueios
  const bloqueioForm = useForm({
    resolver: yupResolver(bloqueioSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      horaInicio: '',
      horaFim: '',
      setorId: '',
      tipoRecorrencia: 'nenhuma',
      observacoes: ''
    }
  });

  const { fields: diasFields, append: appendDia, remove: removeDia } = useFieldArray({
    control: configForm.control,
    name: 'diasSemana'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - substitua pelas chamadas reais da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSetores = [
        { id: 1, nome: 'Gabinete' },
        { id: 2, nome: 'Recursos Humanos' },
        { id: 3, nome: 'Financeiro' },
        { id: 4, nome: 'Tecnologia da Informação' },
        { id: 5, nome: 'Planejamento' }
      ];

      const mockConfiguracoes = [
        {
          id: 1,
          nome: 'Horário Comercial Gabinete',
          descricao: 'Atendimento padrão do gabinete',
          setorId: 1,
          setor: { nome: 'Gabinete' },
          diasSemana: [1, 2, 3, 4, 5],
          horaInicio: '08:00',
          horaFim: '17:00',
          intervaloMinutos: 60,
          maxVisitasPorHorario: 2,
          antecedenciaMinima: 24,
          antecedenciaMaxima: 168,
          observacoes: 'Atendimento de segunda a sexta',
          ativo: true,
          dataCriacao: '2025-01-15T10:00:00Z',
          criadoPor: 'wesleygatinho',
          totalVisitasAgendadas: 45
        },
        {
          id: 2,
          nome: 'Horário RH',
          descricao: 'Atendimento específico do RH',
          setorId: 2,
          setor: { nome: 'Recursos Humanos' },
          diasSemana: [1, 2, 3, 4, 5],
          horaInicio: '08:30',
          horaFim: '16:30',
          intervaloMinutos: 30,
          maxVisitasPorHorario: 1,
          antecedenciaMinima: 48,
          antecedenciaMaxima: 336,
          observacoes: 'Atendimento com agendamento prévio obrigatório',
          ativo: true,
          dataCriacao: '2025-02-01T14:00:00Z',
          criadoPor: 'admin',
          totalVisitasAgendadas: 28
        },
        {
          id: 3,
          nome: 'Horário TI - Manutenção',
          descricao: 'Horário especial para manutenções',
          setorId: 4,
          setor: { nome: 'Tecnologia da Informação' },
          diasSemana: [6],
          horaInicio: '08:00',
          horaFim: '12:00',
          intervaloMinutos: 120,
          maxVisitasPorHorario: 1,
          antecedenciaMinima: 72,
          antecedenciaMaxima: 720,
          observacoes: 'Apenas para manutenções de sistema',
          ativo: false,
          dataCriacao: '2025-03-10T09:00:00Z',
          criadoPor: 'wesleygatinho',
          totalVisitasAgendadas: 5
        }
      ];

      const mockBloqueios = [
        {
          id: 1,
          titulo: 'Reunião Mensal de Diretoria',
          descricao: 'Reunião mensal com toda diretoria',
          dataInicio: '2025-08-15',
          dataFim: '2025-08-15',
          horaInicio: '09:00',
          horaFim: '12:00',
          setorId: 1,
          setor: { nome: 'Gabinete' },
          tipoRecorrencia: 'mensal',
          observacoes: 'Primeira quinta-feira de cada mês',
          dataCriacao: '2025-08-01T10:00:00Z',
          criadoPor: 'wesleygatinho'
        },
        {
          id: 2,
          titulo: 'Manutenção do Sistema',
          descricao: 'Manutenção preventiva dos sistemas',
          dataInicio: '2025-08-10',
          dataFim: '2025-08-10',
          horaInicio: '06:00',
          horaFim: '08:00',
          setorId: 4,
          setor: { nome: 'Tecnologia da Informação' },
          tipoRecorrencia: 'semanal',
          observacoes: 'Todo sábado pela manhã',
          dataCriacao: '2025-07-20T15:00:00Z',
          criadoPor: 'admin'
        },
        {
          id: 3,
          titulo: 'Feriado Nacional',
          descricao: 'Independência do Brasil',
          dataInicio: '2025-09-07',
          dataFim: '2025-09-07',
          horaInicio: '00:00',
          horaFim: '23:59',
          setorId: null,
          setor: null,
          tipoRecorrencia: 'anual',
          observacoes: 'Bloqueio geral - feriado nacional',
          dataCriacao: '2025-01-01T08:00:00Z',
          criadoPor: 'admin'
        }
      ];

      // Dados para o calendário
      const mockCalendario = [
        {
          id: 'config-1',
          title: 'Gabinete 08:00-17:00',
          start: '2025-08-08T08:00:00',
          end: '2025-08-08T17:00:00',
          color: '#10b981',
          type: 'config'
        },
        {
          id: 'bloqueio-1',
          title: 'Reunião Diretoria',
          start: '2025-08-15T09:00:00',
          end: '2025-08-15T12:00:00',
          color: '#ef4444',
          type: 'bloqueio'
        }
      ];

      setSetores(mockSetores);
      setConfiguracoes(mockConfiguracoes);
      setBloqueios(mockBloqueios);
      setCalendarioData(mockCalendario);
      
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para Configurações
  const handleOpenConfigModal = (config = null) => {
    setEditingConfig(config);
    if (config) {
      configForm.setValue('nome', config.nome);
      configForm.setValue('descricao', config.descricao);
      configForm.setValue('setorId', config.setorId);
      configForm.setValue('diasSemana', config.diasSemana);
      configForm.setValue('horaInicio', config.horaInicio);
      configForm.setValue('horaFim', config.horaFim);
      configForm.setValue('intervaloMinutos', config.intervaloMinutos);
      configForm.setValue('maxVisitasPorHorario', config.maxVisitasPorHorario);
      configForm.setValue('antecedenciaMinima', config.antecedenciaMinima);
      configForm.setValue('antecedenciaMaxima', config.antecedenciaMaxima);
      configForm.setValue('observacoes', config.observacoes || '');
      configForm.setValue('ativo', config.ativo);
    } else {
      configForm.reset();
    }
    setShowConfigModal(true);
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
    setEditingConfig(null);
    configForm.reset();
  };

  const onSubmitConfig = async (data) => {
    try {
      if (editingConfig) {
        toast.success('Configuração de horário atualizada com sucesso!');
      } else {
        toast.success('Configuração de horário criada com sucesso!');
      }
      handleCloseConfigModal();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar configuração');
    }
  };

  // Handlers para Bloqueios
  const handleOpenBloqueioModal = (bloqueio = null) => {
    setEditingBloqueio(bloqueio);
    if (bloqueio) {
      bloqueioForm.setValue('titulo', bloqueio.titulo);
      bloqueioForm.setValue('descricao', bloqueio.descricao);
      bloqueioForm.setValue('dataInicio', bloqueio.dataInicio);
      bloqueioForm.setValue('dataFim', bloqueio.dataFim);
      bloqueioForm.setValue('horaInicio', bloqueio.horaInicio);
      bloqueioForm.setValue('horaFim', bloqueio.horaFim);
      bloqueioForm.setValue('setorId', bloqueio.setorId || '');
      bloqueioForm.setValue('tipoRecorrencia', bloqueio.tipoRecorrencia);
      bloqueioForm.setValue('observacoes', bloqueio.observacoes || '');
    } else {
      bloqueioForm.reset();
    }
    setShowBloqueioModal(true);
  };

  const handleCloseBloqueioModal = () => {
    setShowBloqueioModal(false);
    setEditingBloqueio(null);
    bloqueioForm.reset();
  };

  const onSubmitBloqueio = async (data) => {
    try {
      if (editingBloqueio) {
        toast.success('Bloqueio atualizado com sucesso!');
      } else {
        toast.success('Bloqueio criado com sucesso!');
      }
      handleCloseBloqueioModal();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar bloqueio');
    }
  };

  // Handler para exclusões
  const handleDelete = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const message = deleteType === 'config' ? 
        'Configuração excluída com sucesso!' : 
        'Bloqueio excluído com sucesso!';
      
      toast.success(message);
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType('');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir item');
    }
  };

  const toggleConfigStatus = async (config) => {
    try {
      const newStatus = config.ativo ? 'desativada' : 'ativada';
      toast.success(`Configuração ${newStatus} com sucesso!`);
      loadData();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  // Filtros
  const filteredConfiguracoes = configuracoes.filter(config => {
    const matchesSearch = config.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = filterSetor === 'all' || config.setorId.toString() === filterSetor;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'ativo' && config.ativo) ||
                         (filterStatus === 'inativo' && !config.ativo);
    return matchesSearch && matchesSetor && matchesStatus;
  });

  const filteredBloqueios = bloqueios.filter(bloqueio => {
    const matchesSearch = bloqueio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bloqueio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = filterSetor === 'all' || 
                        !bloqueio.setorId || 
                        bloqueio.setorId.toString() === filterSetor;
    return matchesSearch && matchesSetor;
  });

  const getDiasSemanaText = (dias) => {
    return dias.map(dia => DIAS_SEMANA[dia].abrev).join(', ');
  };

  const getRecorrenciaText = (tipo) => {
    const tipos = {
      'nenhuma': 'Único',
      'diaria': 'Diário',
      'semanal': 'Semanal',
      'mensal': 'Mensal',
      'anual': 'Anual'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusBadge = (ativo) => {
    return ativo ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando configurações de horários..." />;
  }

  return (
    <div className="horarios-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Horários</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-clock me-3"></i>
                Configuração de Horários
              </h1>
              <p className="text-muted">
                Gerenciamento de horários de atendimento e bloqueios
              </p>
            </Col>
            <Col xs="auto">
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  <i className="fas fa-plus me-2"></i>
                  Adicionar
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleOpenConfigModal()}>
                    <i className="fas fa-clock me-2"></i>
                    Nova Configuração
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleOpenBloqueioModal()}>
                    <i className="fas fa-ban me-2"></i>
                    Novo Bloqueio
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-cogs"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{configuracoes.length}</h3>
                    <p className="stat-label">Configurações</p>
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
                    <h3 className="stat-number">{configuracoes.filter(c => c.ativo).length}</h3>
                    <p className="stat-label">Ativas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-ban"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{bloqueios.length}</h3>
                    <p className="stat-label">Bloqueios</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{configuracoes.reduce((acc, c) => acc + c.totalVisitasAgendadas, 0)}</h3>
                    <p className="stat-label">Visitas Agendadas</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card>
          <Card.Header className="p-0">
            <Tabs 
              activeKey={activeTab} 
              onSelect={setActiveTab}
              className="nav-tabs-custom"
            >
              <Tab eventKey="configuracoes" title={<><i className="fas fa-cogs me-2"></i>Configurações</>} />
              <Tab eventKey="bloqueios" title={<><i className="fas fa-ban me-2"></i>Bloqueios</>} />
              <Tab eventKey="calendario" title={<><i className="fas fa-calendar me-2"></i>Calendário</>} />
            </Tabs>
          </Card.Header>
          
          <Card.Body className="p-0">
            {/* Filtros */}
            <div className="p-3 border-bottom">
              <Row className="align-items-end">
                <Col md={6} lg={4}>
                  <Form.Group>
                    <Form.Label>Buscar</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Nome, descrição..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4} lg={3}>
                  <Form.Group>
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      value={filterSetor}
                      onChange={e => setFilterSetor(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {activeTab === 'configuracoes' && (
                  <Col md={4} lg={2}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}
                <Col xs="auto">
                  <Button variant="outline-secondary" onClick={loadData}>
                    <i className="fas fa-refresh me-2"></i>
                    Atualizar
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'configuracoes' && (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Configuração</th>
                      <th>Setor</th>
                      <th>Dias/Horários</th>
                      <th>Intervalo</th>
                      <th>Limites</th>
                      <th>Status</th>
                      <th>Visitas</th>
                      <th width="120">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConfiguracoes.map(config => (
                      <tr key={config.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="config-icon me-3">
                              <i className="fas fa-clock"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{config.nome}</div>
                              <div className="text-muted small">{config.descricao}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info">{config.setor.nome}</Badge>
                        </td>
                        <td>
                          <div className="fw-bold">{getDiasSemanaText(config.diasSemana)}</div>
                          <div className="text-muted small">{config.horaInicio} - {config.horaFim}</div>
                        </td>
                        <td>
                          <span className="fw-bold">{config.intervaloMinutos}min</span>
                          <div className="text-muted small">por slot</div>
                        </td>
                        <td>
                          <div className="small">
                            <div><strong>Max:</strong> {config.maxVisitasPorHorario} visita(s)</div>
                            <div><strong>Antec:</strong> {config.antecedenciaMinima}-{config.antecedenciaMaxima}h</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(config.ativo)}</td>
                        <td>
                          <div className="text-center">
                            <span className="fw-bold d-block">{config.totalVisitasAgendadas}</span>
                            <small className="text-muted">agendadas</small>
                          </div>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleOpenConfigModal(config)}>
                                <i className="fas fa-edit me-2"></i>
                                Editar
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => toggleConfigStatus(config)}>
                                <i className={`fas fa-${config.ativo ? 'ban' : 'check'} me-2`}></i>
                                {config.ativo ? 'Desativar' : 'Ativar'}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger" 
                                onClick={() => handleDelete(config, 'config')}
                              >
                                <i className="fas fa-trash me-2"></i>
                                Excluir
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {filteredConfiguracoes.length === 0 && (
                  <div className="text-center py-4">
                    <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Nenhuma configuração encontrada</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bloqueios' && (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Bloqueio</th>
                      <th>Período</th>
                      <th>Horário</th>
                      <th>Setor</th>
                      <th>Recorrência</th>
                      <th>Criado</th>
                      <th width="120">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBloqueios.map(bloqueio => (
                      <tr key={bloqueio.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bloqueio-icon me-3">
                              <i className="fas fa-ban"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{bloqueio.titulo}</div>
                              <div className="text-muted small">{bloqueio.descricao}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatDate(bloqueio.dataInicio)}</div>
                          {bloqueio.dataInicio !== bloqueio.dataFim && (
                            <div className="text-muted small">até {formatDate(bloqueio.dataFim)}</div>
                          )}
                        </td>
                        <td>
                          <div className="font-monospace">
                            {bloqueio.horaInicio} - {bloqueio.horaFim}
                          </div>
                        </td>
                        <td>
                          {bloqueio.setor ? (
                            <Badge bg="info">{bloqueio.setor.nome}</Badge>
                          ) : (
                            <Badge bg="warning">Todos os setores</Badge>
                          )}
                        </td>
                        <td>
                          <Badge bg="secondary">{getRecorrenciaText(bloqueio.tipoRecorrencia)}</Badge>
                        </td>
                        <td>
                          <div className="text-muted small">
                            {formatDate(bloqueio.dataCriacao)}
                            <div>por {bloqueio.criadoPor}</div>
                          </div>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleOpenBloqueioModal(bloqueio)}>
                                <i className="fas fa-edit me-2"></i>
                                Editar
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger" 
                                onClick={() => handleDelete(bloqueio, 'bloqueio')}
                              >
                                <i className="fas fa-trash me-2"></i>
                                Excluir
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {filteredBloqueios.length === 0 && (
                  <div className="text-center py-4">
                    <i className="fas fa-ban fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Nenhum bloqueio encontrado</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendario' && (
              <div className="calendario-container p-4">
                <CalendarioHorarios data={calendarioData} />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal de Configuração */}
        <Modal show={showConfigModal} onHide={handleCloseConfigModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-clock me-2"></i>
              {editingConfig ? 'Editar Configuração' : 'Nova Configuração'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={configForm.handleSubmit(onSubmitConfig)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Configuração</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Horário Comercial Gabinete"
                      {...configForm.register('nome')}
                      isInvalid={!!configForm.formState.errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {configForm.formState.errors.nome?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      {...configForm.register('setorId')}
                      isInvalid={!!configForm.formState.errors.setorId}
                    >
                      <option value="">Selecione um setor</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {configForm.formState.errors.setorId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Breve descrição da configuração"
                  {...configForm.register('descricao')}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dias da Semana</Form.Label>
                <div className="dias-semana-grid">
                  {DIAS_SEMANA.map(dia => (
                    <Form.Check
                      key={dia.id}
                      type="checkbox"
                      id={`dia-${dia.id}`}
                      label={dia.nome}
                      value={dia.id}
                      {...configForm.register('diasSemana')}
                    />
                  ))}
                </div>
              </Form.Group>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Início</Form.Label>
                    <Form.Control
                      type="time"
                      {...configForm.register('horaInicio')}
                      isInvalid={!!configForm.formState.errors.horaInicio}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Fim</Form.Label>
                    <Form.Control
                      type="time"
                      {...configForm.register('horaFim')}
                      isInvalid={!!configForm.formState.errors.horaFim}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Intervalo (min)</Form.Label>
                    <Form.Select
                      {...configForm.register('intervaloMinutos')}
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                      <option value={180}>3 horas</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Visitas/Slot</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="10"
                      {...configForm.register('maxVisitasPorHorario')}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Antecedência Mínima (horas)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      {...configForm.register('antecedenciaMinima')}
                    />
                    <Form.Text className="text-muted">
                      Tempo mínimo para agendar
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Antecedência Máxima (horas)</Form.Label>
                    <Form.Control
                      type="number"
                      min="24"
                      {...configForm.register('antecedenciaMaxima')}
                    />
                    <Form.Text className="text-muted">
                      Tempo máximo para agendar
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Informações adicionais sobre esta configuração..."
                  {...configForm.register('observacoes')}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="switch"
                  id="config-ativo"
                  label="Configuração ativa"
                  {...configForm.register('ativo')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfigModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-save me-2"></i>
                {editingConfig ? 'Atualizar' : 'Criar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Bloqueio */}
        <Modal show={showBloqueioModal} onHide={handleCloseBloqueioModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-ban me-2"></i>
              {editingBloqueio ? 'Editar Bloqueio' : 'Novo Bloqueio'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={bloqueioForm.handleSubmit(onSubmitBloqueio)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Título do Bloqueio</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Reunião Mensal de Diretoria"
                      {...bloqueioForm.register('titulo')}
                      isInvalid={!!bloqueioForm.formState.errors.titulo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {bloqueioForm.formState.errors.titulo?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Setor (opcional)</Form.Label>
                    <Form.Select {...bloqueioForm.register('setorId')}>
                      <option value="">Todos os setores</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Descrição detalhada do bloqueio"
                  {...bloqueioForm.register('descricao')}
                />
              </Form.Group>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data Início</Form.Label>
                    <Form.Control
                      type="date"
                      {...bloqueioForm.register('dataInicio')}
                      isInvalid={!!bloqueioForm.formState.errors.dataInicio}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data Fim</Form.Label>
                    <Form.Control
                      type="date"
                      {...bloqueioForm.register('dataFim')}
                      isInvalid={!!bloqueioForm.formState.errors.dataFim}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Início</Form.Label>
                    <Form.Control
                      type="time"
                      {...bloqueioForm.register('horaInicio')}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Fim</Form.Label>
                    <Form.Control
                      type="time"
                      {...bloqueioForm.register('horaFim')}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Recorrência</Form.Label>
                <Form.Select {...bloqueioForm.register('tipoRecorrencia')}>
                  <option value="nenhuma">Evento único</option>
                  <option value="diaria">Repetir diariamente</option>
                  <option value="semanal">Repetir semanalmente</option>
                  <option value="mensal">Repetir mensalmente</option>
                  <option value="anual">Repetir anualmente</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Define se o bloqueio se repete automaticamente
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Informações adicionais sobre este bloqueio..."
                  {...bloqueioForm.register('observacoes')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseBloqueioModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-save me-2"></i>
                {editingBloqueio ? 'Atualizar' : 'Criar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir ${deleteType === 'config' ? 'esta configuração' : 'este bloqueio'}? Esta ação não pode ser desfeita.`}
          variant="danger"
        />
      </Container>
    </div>
  );
};

export default HorariosPage;