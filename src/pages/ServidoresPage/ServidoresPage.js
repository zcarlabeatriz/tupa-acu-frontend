import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { servidoresService } from '../../services/api/servidoresService';
import { servidorSchema } from '../../services/utils/validators';
import { formatPhone, formatCPF, formatDate } from '../../services/utils/formatters';
// import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, SITUACAO_SERVIDOR, STATUS_CONTA } from '../../services/utils/constants';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import './ServidoresPage.css';

const ServidoresPage = () => {
  const [servidores, setServidores] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingServidor, setEditingServidor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSetor, setFilterSetor] = useState('all');
  const [filterCargo, setFilterCargo] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servidorToDelete, setServidorToDelete] = useState(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [servidorToResetPassword, setServidorToResetPassword] = useState(null);
  
  const { canManageServidores, isAdmin } = usePermissions();

  const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  setValue,
  watch
} = useForm({
  resolver: yupResolver(servidorSchema),
  defaultValues: {
    nome: '',
    email: '',
    cpf: '',
    celular: '',
    matricula: '',
    cargo: '',
    setorId: '',
    papel: ROLES.SERVIDOR,
    situacao: SITUACAO_SERVIDOR.ATIVO,
    senha: '', // Adicionar
    statusConta: STATUS_CONTA.ATIVO // Adicionar
  }
});

  const celularValue = watch('celular');
  const cpfValue = watch('cpf');
  
  useEffect(() => {
    if (celularValue) {
      const formatted = formatPhone(celularValue);
      if (formatted !== celularValue) {
        setValue('celular', formatted);
      }
    }
  }, [celularValue, setValue]);

  useEffect(() => {
    if (cpfValue) {
      const formatted = formatCPF(cpfValue);
      if (formatted !== cpfValue) {
        setValue('cpf', formatted);
      }
    }
  }, [cpfValue, setValue]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedServidores, fetchedSetores] = await Promise.all([
        servidoresService.getTodosServidores(),
        servidoresService.getTodosSetores()
      ]);
      setServidores(fetchedServidores);
      setSetores(fetchedSetores);
    } catch (error) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (servidor = null) => {
    setEditingServidor(servidor);
    if (servidor) {
      reset({
        nome: servidor.nome,
        email: servidor.email,
        cpf: servidor.cpf,
        celular: servidor.celular,
        matricula: servidor.matricula,
        cargo: servidor.cargo,
        setorId: servidor.setor.id,
        papel: servidor.papel,
        situacao: servidor.situacao,
      });
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServidor(null);
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let result;
      const servidorData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        celular: data.celular.replace(/\D/g, ''),
      };

      if (editingServidor) {
        result = await servidoresService.atualizarServidor(editingServidor.id, servidorData);
      } else {
        result = await servidoresService.criarServidor(servidorData);
      }

      if (result.success) {
        toast.success(editingServidor ? 'Servidor atualizado com sucesso!' : 'Servidor cadastrado com sucesso!');
        handleCloseModal();
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao salvar servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteServidor = (servidor) => {
    setServidorToDelete(servidor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await servidoresService.deletarServidor(servidorToDelete.id);
      if (result.success) {
        toast.success('Servidor excluído com sucesso!');
        setShowDeleteModal(false);
        setServidorToDelete(null);
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao excluir servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (servidor) => {
    try {
      const newSituacao = servidor.situacao === SITUACAO_SERVIDOR.ATIVO ? SITUACAO_SERVIDOR.INATIVO : SITUACAO_SERVIDOR.ATIVO;
      const updateData = {
        ...servidor,
        situacao: newSituacao,
        setorId: servidor.setor.id,
      };
      const result = await servidoresService.atualizarServidor(servidor.id, updateData);
      
      if (result.success) {
        toast.success(`Servidor ${newSituacao === SITUACAO_SERVIDOR.ATIVO ? 'ativado' : 'desativado'} com sucesso!`);
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const handleResetPassword = (servidor) => {
    setServidorToResetPassword(servidor);
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      // TODO: Adicionar um endpoint de reset de senha na API
      toast.success('Nova senha enviada por email!');
      setShowResetPasswordModal(false);
      setServidorToResetPassword(null);
    } catch (error) {
      toast.error('Erro ao resetar senha');
    }
  };

  const filteredServidores = servidores.filter(servidor => {
    const matchesSearch = servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          servidor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          servidor.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          servidor.cpf.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || servidor.situacao === filterStatus;
    const matchesSetor = filterSetor === 'all' || (servidor.setor && servidor.setor.id.toString() === filterSetor);
    const matchesCargo = filterCargo === 'all' || servidor.papel === filterCargo;
    return matchesSearch && matchesStatus && matchesSetor && matchesCargo;
  });

  const getStatusBadge = (situacao) => {
    switch (situacao) {
      case SITUACAO_SERVIDOR.ATIVO: return <Badge bg="success">Ativo</Badge>;
      case SITUACAO_SERVIDOR.INATIVO: return <Badge bg="secondary">Inativo</Badge>;
      case SITUACAO_SERVIDOR.FERIAS: return <Badge bg="warning">Férias</Badge>;
      case SITUACAO_SERVIDOR.LICENCA: return <Badge bg="info">Licença</Badge>;
      default: return <Badge bg="light">Desconhecido</Badge>;
    }
  };

  const getPapelBadge = (papel) => {
    const variants = {
      [ROLES.ADMIN]: 'danger',
      [ROLES.RECEPCIONISTA]: 'warning',
      [ROLES.SERVIDOR]: 'primary'
    };
    
    const labels = {
      [ROLES.ADMIN]: ROLES.ADMIN,
      [ROLES.RECEPCIONISTA]: ROLES.RECEPCIONISTA,
      [ROLES.SERVIDOR]: ROLES.SERVIDOR
    };

    return <Badge bg={variants[papel] || 'secondary'}>{labels[papel] || papel}</Badge>;
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando servidores..." />;
  }

  return (
    <div className="servidores-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Servidores</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-user-tie me-3"></i>
                Gerenciar Servidores
              </h1>
              <p className="text-muted">
                Cadastro e gerenciamento de servidores do sistema
              </p>
            </Col>
            <Col xs="auto">
              {canManageServidores() && (
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="fas fa-plus me-2"></i>
                  Novo Servidor
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {/* Estatísticas rápidas */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-primary">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-users"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{servidores.length}</h3>
                    <p className="stat-label">Total Servidores</p>
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
                    <h3 className="stat-number">{servidores.filter(s => s.situacao === SITUACAO_SERVIDOR.ATIVO).length}</h3>
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
                  <div className="stat-icon"><i className="fas fa-user-shield"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{servidores.filter(s => s.papel === ROLES.ADMIN).length}</h3>
                    <p className="stat-label">Administradores</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-building"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{setores.length}</h3>
                    <p className="stat-label">Setores</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card className="mb-4">
          <Card.Body>
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
                      placeholder="Nome, email, matrícula..."
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
                    <option value={SITUACAO_SERVIDOR.ATIVO}>Ativos</option>
                    <option value={SITUACAO_SERVIDOR.INATIVO}>Inativos</option>
                    <option value={SITUACAO_SERVIDOR.FERIAS}>Férias</option>
                    <option value={SITUACAO_SERVIDOR.LICENCA}>Licença</option>
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
                      <option key={setor.id} value={setor.id}>{setor.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} lg={2}>
                <Form.Group>
                  <Form.Label>Papel</Form.Label>
                  <Form.Select
                    value={filterCargo}
                    onChange={e => setFilterCargo(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value={ROLES.ADMIN}>Administrador</option>
                    <option value={ROLES.RECEPCIONISTA}>Recepcionista</option>
                    <option value={ROLES.SERVIDOR}>Servidor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Button variant="outline-secondary" onClick={loadData}>
                  <i className="fas fa-refresh me-2"></i>
                  Atualizar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabela */}
        <Card>
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Lista de Servidores ({filteredServidores.length})
            </h6>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Servidor</th>
                    <th>Email</th>
                    <th>Matrícula</th>
                    <th>Cargo/Setor</th>
                    <th>Papel</th>
                    <th>Status</th>
                    {/* <th>Visitas</th> */}
                    <th>Último Login</th>
                    <th width="120">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServidores.map(servidor => (
                    <tr key={servidor.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="server-avatar me-3">
                            <i className="fas fa-user-tie"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{servidor.nome}</div>
                            <div className="text-muted small">{servidor.cpf}</div>
                          </div>
                        </div>
                      </td>
                      <td>{servidor.email}</td>
                      <td className="font-monospace">{servidor.matricula}</td>
                      <td>
                        <div className="fw-bold">{servidor.cargo}</div>
                        <div className="text-muted small">{servidor.setor.nome}</div>
                      </td>
                      <td>{getPapelBadge(servidor.papel)}</td>
                      <td>{getStatusBadge(servidor.situacao)}</td>
                      <td>
                        <div className="text-muted small">
                          {servidor.ultimoLogin ? formatDate(servidor.ultimoLogin) : 'Nunca'}
                        </div>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="fas fa-ellipsis-v"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOpenModal(servidor)}>
                              <i className="fas fa-edit me-2"></i>
                              Editar
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => toggleStatus(servidor)}>
                              <i className={`fas fa-${servidor.situacao === SITUACAO_SERVIDOR.ATIVO ? 'ban' : 'check'} me-2`}></i>
                              {servidor.situacao === SITUACAO_SERVIDOR.ATIVO ? 'Desativar' : 'Ativar'}
                            </Dropdown.Item>
                            {isAdmin() && (
                              <>
                                <Dropdown.Item onClick={() => handleResetPassword(servidor)}>
                                  <i className="fas fa-key me-2"></i>
                                  Resetar Senha
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger" 
                                  onClick={() => handleDeleteServidor(servidor)}
                                >
                                  <i className="fas fa-trash me-2"></i>
                                  Excluir
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredServidores.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-user-tie fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Nenhum servidor encontrado</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user-tie me-2"></i>
              {editingServidor ? 'Editar Servidor' : 'Novo Servidor'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome completo"
                      {...register('nome')}
                      isInvalid={!!errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@seduc.ma.gov.br"
                      {...register('email')}
                      isInvalid={!!errors.email}
                      readOnly={!!editingServidor}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
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
                      {...register('cpf')}
                      isInvalid={!!errors.cpf}
                      readOnly={!!editingServidor}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cpf?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Celular</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="(99) 99999-9999"
                      {...register('celular')}
                      isInvalid={!!errors.celular}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.celular?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Matrícula</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MAT001"
                      {...register('matricula')}
                      isInvalid={!!errors.matricula}
                      readOnly={!!editingServidor}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.matricula?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Analista de TI"
                      {...register('cargo')}
                      isInvalid={!!errors.cargo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cargo?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      {...register('setorId')}
                      isInvalid={!!errors.setorId}
                    >
                      <option value="">Selecione um setor</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>{setor.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.setorId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Papel no Sistema</Form.Label>
                    <Form.Select
                      {...register('papel')}
                      isInvalid={!!errors.papel}
                    >
                      <option value={ROLES.SERVIDOR}>{ROLES.SERVIDOR}</option>
                      <option value={ROLES.RECEPCIONISTA}>{ROLES.RECEPCIONISTA}</option>
                      {isAdmin() && (
                        <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
                      )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.papel?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha temporária"
            {...register('senha')}
            isInvalid={!!errors.senha}
          />
          <Form.Control.Feedback type="invalid">
            {errors.senha?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Status da Conta</Form.Label>
          <Form.Select
            {...register('statusConta')}
            isInvalid={!!errors.statusConta}
          >
            <option value={STATUS_CONTA.ATIVO}>{STATUS_CONTA.ATIVO}</option>
            <option value={STATUS_CONTA.INATIVO}>{STATUS_CONTA.INATIVO}</option>
            <option value={STATUS_CONTA.PENDENTE_VALIDACAO}>{STATUS_CONTA.PENDENTE_VALIDACAO}</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.statusConta?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observações adicionais..."
                  {...register('observacoes')}
                />
              </Form.Group>
              {!editingServidor && (
                <Alert variant="info" className="mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Uma senha temporária será enviada para o email do servidor após o cadastro.
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <i className="fas fa-save me-2"></i>
                {editingServidor ? 'Atualizar' : 'Cadastrar'}
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
          message={`Tem certeza que deseja excluir o servidor "${servidorToDelete?.nome}"? Esta ação não pode ser desfeita.`}
          variant="danger"
        />

        {/* Modal de Reset de Senha */}
        <ConfirmModal
          show={showResetPasswordModal}
          onHide={() => setShowResetPasswordModal(false)}
          onConfirm={confirmResetPassword}
          title="Resetar Senha"
          message={`Deseja resetar a senha do servidor "${servidorToResetPassword?.nome}"? Uma nova senha será enviada por email.`}
          variant="warning"
          confirmText="Resetar"
        />
      </Container>
    </div>
  );
};

export default ServidoresPage;