import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { horariosService } from '../../services/api/horariosService';
import { organogramaService } from '../../services/api/organogramaService';
import { horarioAtendimentoSchema, bloqueioSchema } from '../../services/utils/validators';
import { formatDate, formatDateTime, formatTime } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import CalendarioHorarios from '../../components/horarios/CalendarioHorarios/CalendarioHorarios';
import './HorariosPage.css';

const DIAS_SEMANA = [
  { id: 'DOMINGO', nome: 'Domingo', abrev: 'Dom' },
  { id: 'SEGUNDA', nome: 'Segunda-feira', abrev: 'Seg' },
  { id: 'TERCA', nome: 'Terça-feira', abrev: 'Ter' },
  { id: 'QUARTA', nome: 'Quarta-feira', abrev: 'Qua' },
  { id: 'QUINTA', nome: 'Quinta-feira', abrev: 'Qui' },
  { id: 'SEXTA', nome: 'Sexta-feira', abrev: 'Sex' },
  { id: 'SABADO', nome: 'Sábado', abrev: 'Sab' }
];

const HorariosPage = () => {
  const [horarios, setHorarios] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [showBloqueioModal, setShowBloqueioModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [editingBloqueio, setEditingBloqueio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSetor, setFilterSetor] = useState('all');
  const [filterDia, setFilterDia] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [activeTab, setActiveTab] = useState('horarios');
  const [calendarioData, setCalendarioData] = useState([]);
  
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  // Form para horários
  const horarioForm = useForm({
    resolver: yupResolver(horarioAtendimentoSchema),
    defaultValues: {
      setorId: '',
      diaSemana: '',
      horaInicio: '',
      horaFim: ''
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



  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Carregando dados da página de horários...');
      
      // Carregar setores
      console.log('📋 Carregando setores...');
      const setoresData = await organogramaService.listarTodos();
      console.log('✅ Setores carregados:', setoresData.length, 'itens');
      setSetores(setoresData);
      
      // Carregar horários de atendimento
      console.log('⏰ Carregando horários...');
      const horariosData = await horariosService.listarTodos();
      console.log('✅ Horários carregados:', horariosData.length, 'itens');
      console.log('📊 Dados dos horários:', horariosData);
      setHorarios(horariosData);
      
      // Preparar dados para o calendário
      const calData = horariosData.map(horario => ({
        id: horario.id,
        title: `${horario.setorNome} - ${horario.diaSemana}`,
        setor: horario.setorNome,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFim: horario.horaFim
      }));
      
      setCalendarioData(calData);
      console.log('🎯 Dados carregados com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      console.error('📡 Detalhes do erro:', error.response?.data);
      toast.error(`Erro ao carregar dados: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para Horários
  const handleOpenHorarioModal = (horario = null) => {
    setEditingHorario(horario);
    if (horario) {
      horarioForm.setValue('setorId', horario.setorId);
      horarioForm.setValue('diaSemana', horario.diaSemana);
      horarioForm.setValue('horaInicio', horario.horaInicio);
      horarioForm.setValue('horaFim', horario.horaFim);
    } else {
      horarioForm.reset();
    }
    setShowHorarioModal(true);
  };

  const handleCloseHorarioModal = () => {
    setShowHorarioModal(false);
    setEditingHorario(null);
    horarioForm.reset();
  };

  const handleSaveHorario = async (data) => {
    try {
      if (editingHorario) {
        await horariosService.atualizar(editingHorario.id, data);
        toast.success('Horário atualizado com sucesso!');
      } else {
        await horariosService.criar(data);
        toast.success('Horário criado com sucesso!');
      }
      
      setShowHorarioModal(false);
      setEditingHorario(null);
      horarioForm.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      toast.error('Erro ao salvar horário');
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
      if (deleteType === 'horario') {
        await horariosService.deletar(itemToDelete.id);
        toast.success('Horário deletado com sucesso!');
      } else if (deleteType === 'bloqueio') {
        console.log('Deletando bloqueio:', itemToDelete.id);
        toast.success('Bloqueio deletado com sucesso!');
      }
      
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType('');
      loadData();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast.error('Erro ao deletar item');
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
  const filteredHorarios = horarios.filter(horario => {
    const matchesSearch = horario.setorNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         horario.diaSemana.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = filterSetor === 'all' || horario.setorId.toString() === filterSetor;
    const matchesDia = filterDia === 'all' || horario.diaSemana === filterDia;
    
    return matchesSearch && matchesSetor && matchesDia;
  });

  const filteredBloqueios = bloqueios.filter(bloqueio => {
    const matchesSearch = bloqueio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bloqueio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = filterSetor === 'all' || 
                        !bloqueio.setorId || 
                        bloqueio.setorId.toString() === filterSetor;
    return matchesSearch && matchesSetor;
  });

  // Função para obter texto do dia da semana
  const getDiaSemanaText = (diaSemana) => {
    const dia = DIAS_SEMANA.find(d => d.id === diaSemana);
    return dia ? dia.nome : diaSemana;
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
                  <Dropdown.Item onClick={() => handleOpenHorarioModal()}>
                    <i className="fas fa-clock me-2"></i>
                    Novo Horário
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
                    <h3 className="stat-number">{horarios.length}</h3>
                    <p className="stat-label">Horários</p>
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
                    <h3 className="stat-number">{horarios.length}</h3>
                    <p className="stat-label">Ativos</p>
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
                    <h3 className="stat-number">0</h3>
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
              <Tab eventKey="horarios" title={<><i className="fas fa-clock me-2"></i>Horários</>} />
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
                {activeTab === 'horarios' && (
                   <Col md={4} lg={2}>
                     <Form.Group>
                       <Form.Label>Dia da Semana</Form.Label>
                       <Form.Select 
                         value={filterDia} 
                         onChange={(e) => setFilterDia(e.target.value)}
                       >
                         <option value="all">Todos</option>
                         {DIAS_SEMANA.map(dia => (
                           <option key={dia.id} value={dia.id}>{dia.nome}</option>
                         ))}
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
            {activeTab === 'horarios' && (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Setor</th>
                      <th>Dia da Semana</th>
                      <th>Horário</th>
                      <th>Status</th>
                      <th width="120">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHorarios.map(horario => (
                      <tr key={horario.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="horario-icon me-3">
                              <i className="fas fa-building"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{horario.setorNome}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info">{getDiaSemanaText(horario.diaSemana)}</Badge>
                        </td>
                        <td>
                          <div className="fw-bold">{horario.horaInicio} - {horario.horaFim}</div>
                        </td>
                        <td><Badge bg="success">Ativo</Badge></td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleOpenHorarioModal(horario)}>
                                <i className="fas fa-edit me-2"></i>
                                Editar
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger" 
                                onClick={() => handleDelete(horario, 'horario')}
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
                {filteredHorarios.length === 0 && (
                  <div className="text-center py-4">
                    <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Nenhum horário encontrado</p>
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

        {/* Modal de Horário */}
        <Modal show={showHorarioModal} onHide={handleCloseHorarioModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-clock me-2"></i>
              {editingHorario ? 'Editar Horário' : 'Novo Horário'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={horarioForm.handleSubmit(handleSaveHorario)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      {...horarioForm.register('setorId')}
                      isInvalid={!!horarioForm.formState.errors.setorId}
                    >
                      <option value="">Selecione um setor</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {horarioForm.formState.errors.setorId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dia da Semana</Form.Label>
                    <Form.Select
                      {...horarioForm.register('diaSemana')}
                      isInvalid={!!horarioForm.formState.errors.diaSemana}
                    >
                      <option value="">Selecione um dia</option>
                      {DIAS_SEMANA.map(dia => (
                        <option key={dia.id} value={dia.id}>{dia.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {horarioForm.formState.errors.diaSemana?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Início</Form.Label>
                    <Form.Control
                      type="time"
                      {...horarioForm.register('horaInicio')}
                      isInvalid={!!horarioForm.formState.errors.horaInicio}
                    />
                    <Form.Control.Feedback type="invalid">
                      {horarioForm.formState.errors.horaInicio?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora Fim</Form.Label>
                    <Form.Control
                      type="time"
                      {...horarioForm.register('horaFim')}
                      isInvalid={!!horarioForm.formState.errors.horaFim}
                    />
                    <Form.Control.Feedback type="invalid">
                      {horarioForm.formState.errors.horaFim?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseHorarioModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-save me-2"></i>
                {editingHorario ? 'Atualizar' : 'Criar'}
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
          message={`Tem certeza que deseja excluir ${deleteType === 'horario' ? 'este horário' : 'este bloqueio'}? Esta ação não pode ser desfeita.`}
          variant="danger"
        />
      </Container>
    </div>
  );
};

export default HorariosPage;