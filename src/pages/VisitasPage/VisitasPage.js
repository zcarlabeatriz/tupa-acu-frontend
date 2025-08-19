import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { visitasService } from '../../services/api/visitasService';
import { servidoresService } from '../../services/api/servidoresService';
import { organogramaService } from '../../services/api/organogramaService';
import { pessoasService } from '../../services/api/pessoasService';
import { visitaSchema } from '../../services/utils/validators';
import { formatPhone, formatCPF, formatDate, formatDateTime } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, SITUACAO_VISITA } from '../../services/utils/constants';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import './VisitasPage.css';

const VisitasPage = () => {
  const [visitas, setVisitas] = useState([]);
  const [servidores, setServidores] = useState([]);
  const [setores, setSetores] = useState([]);
  const [selectedSetor, setSelectedSetor] = useState('');
  const [servidoresDoSetor, setServidoresDoSetor] = useState([]);
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
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

  // Buscar servidores quando setor é selecionado
  useEffect(() => {
    const buscarServidoresDoSetor = async () => {
      if (selectedSetor) {
        try {
          const servidoresData = await servidoresService.getServidoresPorSetor(selectedSetor);
          setServidoresDoSetor(servidoresData);
          
          // Se não há servidores no setor, buscar o responsável/chefe
          if (servidoresData.length === 0) {
            toast.warning('Nenhum servidor encontrado neste setor. Selecione outro setor.');
          }
        } catch (error) {
          console.error('Erro ao buscar servidores do setor:', error);
          toast.error('Erro ao carregar servidores do setor');
          setServidoresDoSetor([]);
        }
      } else {
        setServidoresDoSetor([]);
        setValue('servidorId', '');
      }
    };

    buscarServidoresDoSetor();
  }, [selectedSetor, setValue]);

  useEffect(() => {
    if (visitanteCpfValue) {
      const formatted = formatCPF(visitanteCpfValue);
      if (formatted !== visitanteCpfValue) {
        setValue('visitanteCpf', formatted);
      }
    }
  }, [visitanteCpfValue, setValue]);

  // Filtrar servidores quando setor for selecionado
  useEffect(() => {
    if (selectedSetor) {
      const servidoresFiltrados = servidores.filter(servidor => 
        servidor.setor?.id === parseInt(selectedSetor)
      );
      setServidoresDoSetor(servidoresFiltrados);
    } else {
      setServidoresDoSetor([]);
    }
    // Limpar seleção de servidor quando setor mudar
    setValue('servidorId', '');
  }, [selectedSetor, servidores, setValue]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [visitasData, servidoresData, setoresData] = await Promise.all([
        visitasService.listarTodas(),
        servidoresService.getTodosServidores(),
        organogramaService.listarTodos()
      ]);

      setVisitas(visitasData || []);
      setServidores(servidoresData || []);
      setSetores(setoresData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = async (visita = null) => {
    setEditingVisita(visita);
    if (visita) {
      setValue('visitanteNome', visita.visitante.nome);
      setValue('visitanteEmail', visita.visitante.email);
      setValue('visitanteCpf', visita.visitante.cpf);
      setValue('visitanteCelular', visita.visitante.celular);
      setValue('visitanteEmpresa', visita.visitante.empresa || '');
      
      // Definir setor e servidor
       const setorId = visita.servidorVisitado?.setor?.id?.toString() || '';
       setSelectedSetor(setorId);
       setValue('servidorId', visita.servidorVisitado?.id || '');
      
      setValue('dataVisita', visita.dataVisita);
      setValue('horaInicio', visita.horaInicio);
      setValue('horaFim', visita.horaFim);
      setValue('motivo', visita.motivo);
      setValue('observacoes', visita.observacoes || '');
    } else {
      reset();
      
      // Se o usuário for VISITANTE, preencher automaticamente seus dados
      if (user?.papel === ROLES.VISITANTE) {
        try {
          const response = await pessoasService.getPessoaLogada();
          if (response.success) {
            const pessoaData = response.data;
            setValue('visitanteNome', pessoaData.nome || '');
            setValue('visitanteEmail', pessoaData.email || '');
            setValue('visitanteCpf', pessoaData.cpf || '');
            setValue('visitanteCelular', pessoaData.celular || '');
            setValue('visitanteEmpresa', pessoaData.empresa || '');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          toast.error('Erro ao carregar seus dados. Preencha manualmente.');
        }
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVisita(null);
    setSelectedSetor('');
    setServidoresDoSetor([]);
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

  const confirmReject = async () => {
    try {
      if (!rejectReason.trim()) {
        toast.error('Por favor, informe o motivo da rejeição.');
        return;
      }

      const result = await visitasService.negar(actionVisita.id, rejectReason);
      
      if (result.success) {
        toast.success('Visita rejeitada com sucesso!');
        setShowRejectModal(false);
        setActionVisita(null);
        setActionType('');
        setRejectReason('');
        setActiveTab('todas');
        loadData();
      } else {
        toast.error(result.error || 'Erro ao rejeitar visita');
      }
    } catch (error) {
      toast.error('Erro ao rejeitar visita');
    }
  };

  const confirmAction = async () => {
    try {
      let result;
      let message = '';
      
      switch (actionType) {
        case 'approve':
          result = await visitasService.aprovar(actionVisita.id);
          message = 'Visita aprovada com sucesso!';
          break;
        case 'reject':
          // Abre modal específico para rejeição
          setShowActionModal(false);
          setShowRejectModal(true);
          return;
        case 'cancel':
          const motivoCancelamento = prompt('Motivo do cancelamento (opcional):');
          result = await visitasService.cancelar(actionVisita.id, motivoCancelamento || '');
          message = 'Visita cancelada com sucesso!';
          break;
        case 'checkin':
          result = await visitasService.checkIn(actionVisita.id);
          message = 'Check-in realizado com sucesso!';
          break;
        case 'checkout':
          result = await visitasService.checkOut(actionVisita.id);
          message = 'Check-out realizado com sucesso!';
          break;
        case 'delete':
          result = await visitasService.deletar(actionVisita.id);
          message = 'Visita excluída com sucesso!';
          break;
        default:
          throw new Error('Ação não reconhecida');
      }
      
      if (result.success) {
        toast.success(message);
        setShowActionModal(false);
        setActionVisita(null);
        setActionType('');
        
        // Mudar para aba apropriada após a ação
        if (actionType === 'approve') {
          setActiveTab('aprovadas');
        } else if (actionType === 'reject' || actionType === 'cancel') {
          setActiveTab('todas');
        }
        
        loadData();
      } else {
        toast.error(result.error || 'Erro ao executar ação');
      }
    } catch (error) {
      toast.error('Erro ao executar ação');
    }
  };

  const onSubmit = async (data) => {
    try {
      // Validar se pelo menos setor foi selecionado
      if (!selectedSetor) {
        toast.error('Selecione um setor para a visita');
        return;
      }

      const visitaData = {
        visitanteId: user.id, // ID do usuário logado
        servidorVisitadoId: data.servidorId ? parseInt(data.servidorId) : null,
        setorId: parseInt(selectedSetor),
        motivo: data.motivo,
        observacoes: data.observacoes || '',
        dataHoraAgendamento: `${data.dataVisita}T${data.horaInicio}:00`,
        dataHoraFim: `${data.dataVisita}T${data.horaFim}:00`,
        visitante: {
          nome: data.visitanteNome,
          email: data.visitanteEmail,
          cpf: data.visitanteCpf.replace(/\D/g, ''),
          celular: data.visitanteCelular.replace(/\D/g, ''),
          empresa: data.visitanteEmpresa || null
        }
      };

      let result;
      if (editingVisita) {
        result = await visitasService.atualizar(editingVisita.id, visitaData);
      } else {
        result = await visitasService.agendar(visitaData);
      }
      
      if (result.success) {
        if (editingVisita) {
          toast.success('Visita atualizada com sucesso!');
        } else {
          toast.success('Visita agendada com sucesso! Aguarde aprovação.');
        }
        handleCloseModal();
        loadData();
      } else {
        // Exibir mensagem de erro mais detalhada
        const errorMessage = result.error || 'Erro ao salvar visita';
        
        // Se for erro de horário, exibir em formato mais amigável
        if (errorMessage.includes('expediente') || errorMessage.includes('horário')) {
          toast.error(errorMessage, {
            duration: 8000, // Mais tempo para ler a mensagem
            style: {
              maxWidth: '500px',
              fontSize: '14px'
            }
          });
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar visita:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erro inesperado ao salvar visita';
      
      // Se for erro de horário, exibir em formato mais amigável
      if (errorMessage.includes('expediente') || errorMessage.includes('horário')) {
        toast.error(errorMessage, {
          duration: 8000, // Mais tempo para ler a mensagem
          style: {
            maxWidth: '500px',
            fontSize: '14px'
          }
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Filtrar visitas
  const filteredVisitas = visitas.filter(visita => {
    try {
      const matchesSearch = visita.visitante?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           visita.visitante?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           visita.servidorVisitado?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           visita.protocolo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || visita.situacao === filterStatus;
      const matchesSetor = filterSetor === 'all' || visita.setorVisitadoId === parseInt(filterSetor);
      const matchesData = !filterData || visita.dataHoraAgendamento?.startsWith(filterData);
      
      if (!visita.visitante || !visita.servidorVisitado) {
        return false;
      }
      
      // Filtro por aba
      let matchesTab = true;
      switch (activeTab) {
        case 'pendentes':
          matchesTab = visita.situacao === SITUACAO_VISITA.AGUARDANDO_APROVACAO;
          break;
        case 'aprovadas':
          matchesTab = visita.situacao === SITUACAO_VISITA.APROVADA;
          break;
        case 'minhas':
          matchesTab = user?.papel === ROLES.SERVIDOR ? 
            visita.servidorVisitado?.id === user.id : 
            visita.visitante?.id === user.id;
          break;
        default:
          matchesTab = true;
      }
      
      return matchesSearch && matchesStatus && matchesSetor && matchesData && matchesTab;
    } catch (error) {
      return false;
    }
  });
  


  const getStatusBadge = (situacao) => {
    const variants = {
      [SITUACAO_VISITA.AGUARDANDO_APROVACAO]: { bg: 'warning', text: 'Aguardando Aprovação' },
      [SITUACAO_VISITA.APROVADA]: { bg: 'success', text: 'Aprovada' },
      [SITUACAO_VISITA.NEGADA]: { bg: 'danger', text: 'Negada' },
      [SITUACAO_VISITA.EM_ANDAMENTO]: { bg: 'primary', text: 'Em Andamento' },
      [SITUACAO_VISITA.FINALIZADA]: { bg: 'info', text: 'Finalizada' },
      [SITUACAO_VISITA.CANCELADA]: { bg: 'secondary', text: 'Cancelada' }
    };
    
    const config = variants[situacao] || { bg: 'secondary', text: situacao };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getActionMessage = () => {
    const messages = {
      approve: `Deseja aprovar a visita de "${actionVisita?.visitante.nome}"?`,
      reject: `Deseja rejeitar a visita de "${actionVisita?.visitante.nome}"?`,
      cancel: `Deseja cancelar a visita de "${actionVisita?.visitante.nome}"?`,
      checkin: `Confirmar check-in de "${actionVisita?.visitante.nome}"?`,
      checkout: `Confirmar check-out de "${actionVisita?.visitante.nome}"?`,
      delete: `Deseja excluir permanentemente a visita de "${actionVisita?.visitante.nome}"? Esta ação não pode ser desfeita.`
    };
    return messages[actionType] || 'Confirmar ação?';
  };

  const getActionTitle = () => {
    const titles = {
      approve: 'Aprovar Visita',
      reject: 'Rejeitar Visita',
      cancel: 'Cancelar Visita',
      checkin: 'Check-in',
      checkout: 'Check-out',
      delete: 'Excluir Visita'
    };
    return titles[actionType] || 'Confirmar Ação';
  };

  const canPerformAction = (visita, action) => {
    switch (action) {
      case 'approve':
      case 'reject':
        return canApproveVisitas() && visita.situacao === SITUACAO_VISITA.AGUARDANDO_APROVACAO;
      case 'cancel':
        return canManageVisitas() && [SITUACAO_VISITA.AGUARDANDO_APROVACAO, SITUACAO_VISITA.APROVADA].includes(visita.situacao);
      case 'checkin':
        return canApproveVisitas() && visita.situacao === SITUACAO_VISITA.APROVADA;
      case 'checkout':
        return canApproveVisitas() && visita.situacao === SITUACAO_VISITA.EM_ANDAMENTO;
      case 'delete':
        return canManageVisitas(); // ADMIN, SERVIDOR e RECEPCIONISTA podem excluir
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
                    <h3 className="stat-number">{visitas.filter(v => v.situacao === SITUACAO_VISITA.AGUARDANDO_APROVACAO).length}</h3>
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
                    <h3 className="stat-number">{visitas.filter(v => v.situacao === SITUACAO_VISITA.APROVADA).length}</h3>
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
                    <h3 className="stat-number">{visitas.filter(v => v.situacao === SITUACAO_VISITA.FINALIZADA).length}</h3>
                    <p className="stat-label">Finalizadas</p>
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
                      <option value={SITUACAO_VISITA.AGUARDANDO_APROVACAO}>Aguardando Aprovação</option>
                      <option value={SITUACAO_VISITA.APROVADA}>Aprovada</option>
                      <option value={SITUACAO_VISITA.NEGADA}>Negada</option>
                      <option value={SITUACAO_VISITA.EM_ANDAMENTO}>Em Andamento</option>
                      <option value={SITUACAO_VISITA.FINALIZADA}>Finalizada</option>
                      <option value={SITUACAO_VISITA.CANCELADA}>Cancelada</option>
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
                          {formatDate(visita.dataSolicitacao || visita.dataCriacao)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="visitante-avatar me-3">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{visita.visitante.nome}</div>
                            <div className="text-muted small">{visita.visitante.empresa || visita.visitante.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{visita.servidorVisitado?.nome || '—'}</div>
                        <div className="text-muted small">{visita.setorVisitadoNome || '—'}</div>
                      </td>
                      <td>
                        <div className="fw-bold">{formatDate(visita.dataHoraAgendamento)}</div>
                        <div className="text-muted small">
                          {formatDateTime(visita.dataHoraAgendamento).split(' ')[1]} - {visita.dataHoraFim ? formatDateTime(visita.dataHoraFim).split(' ')[1] : '—'}
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
                      <td>{getStatusBadge(visita.situacao)}</td>
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
                              {canPerformAction(visita, 'delete') && (
                                <Dropdown.Item 
                                  className="text-danger" 
                                  onClick={() => handleAction(visita, 'delete')}
                                >
                                  <i className="fas fa-trash me-2"></i>
                                  Excluir
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
                <Form.Label>Setor a Visitar</Form.Label>
                <Form.Select
                  value={selectedSetor}
                  onChange={(e) => setSelectedSetor(e.target.value)}
                >
                  <option value="">Selecione um setor</option>
                  {setores.map(setor => (
                    <option key={setor.id} value={setor.id}>
                      {setor.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Servidor a Visitar <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('servidorId')}
                  isInvalid={!!errors.servidorId}
                  disabled={!selectedSetor}
                >
                  <option value="">Selecione um servidor</option>
                  {servidoresDoSetor.map(servidor => (
                    <option key={servidor.id} value={servidor.id}>
                      {servidor.nome} - {servidor.cargo}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.servidorId?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {selectedSetor ? 
                    (servidoresDoSetor.length > 0 ? 
                      'Selecione o servidor que você deseja visitar' : 
                      'Carregando servidores do setor...'
                    ) : 
                    'Primeiro selecione um setor'
                  }
                </Form.Text>
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
                      <p><strong>CPF:</strong> {formatCPF(selectedVisita.visitante.cpf)}</p>
                      <p><strong>Celular:</strong> {formatPhone(selectedVisita.visitante.celular)}</p>
                      <p><strong>Empresa:</strong> {selectedVisita.visitante.empresa || '—'}</p>
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
                      <p><strong>Servidor:</strong> {selectedVisita.servidorVisitado?.nome || 'N/A'}</p>
                      <p><strong>Setor:</strong> {selectedVisita.setorVisitadoNome || selectedVisita.servidorVisitado?.setor?.nome || 'N/A'}</p>
                      <p><strong>Data:</strong> {formatDate(selectedVisita.dataHoraAgendamento)}</p>
                      <p><strong>Horário:</strong> {formatDateTime(selectedVisita.dataHoraAgendamento).split(' ')[1]} - {selectedVisita.dataHoraFim ? formatDateTime(selectedVisita.dataHoraFim).split(' ')[1] : '—'}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedVisita.situacao)}</p>
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
                      <p><strong>Solicitado em:</strong> {formatDateTime(selectedVisita.dataSolicitacao || selectedVisita.dataCriacao)}</p>
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

        {/* Modal de Rejeição */}
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-times-circle me-2 text-danger"></i>
              Rejeitar Visita
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Você está prestes a rejeitar a visita de <strong>{actionVisita?.visitante?.nome}</strong>.
            </Alert>
            
            <Form.Group className="mb-3">
              <Form.Label>Motivo da Rejeição <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Informe o motivo da rejeição da visita..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
              />
              <Form.Text className="text-muted">
                {rejectReason.length}/500 caracteres
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              <i className="fas fa-times me-2"></i>
              Rejeitar Visita
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
          variant={actionType === 'approve' ? 'success' : (actionType === 'reject' || actionType === 'delete') ? 'danger' : 'warning'}
          confirmText={actionType === 'approve' ? 'Aprovar' : actionType === 'reject' ? 'Rejeitar' : actionType === 'delete' ? 'Excluir' : 'Confirmar'}
        />
      </Container>
    </div>
  );
};

export default VisitasPage;