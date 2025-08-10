import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { pessoasService } from '../../services/api/pessoasService';
import { pessoaSchema } from '../../services/utils/validators';
import { formatPhone, formatCPF, formatDate } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import { ROLES, STATUS_CONTA } from '../../services/utils/constants'; 
import './PessoasPage.css';

const PessoasPage = () => {
  const [pessoas, setPessoas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  
  const { canManagePessoas } = usePermissions();

  const validationSchema = editingPessoa ? pessoaSchema : pessoaSchema.concat(
    yup.object({
      senha: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
      papel: yup.string().required('Papel é obrigatório'),
      statusConta: yup.string().required('Status da conta é obrigatório')
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      celular: '',
      senha: '',
      papel: ROLES.VISITANTE, 
      statusConta: STATUS_CONTA.PENDENTE_VALIDACAO,
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
    loadPessoas();
  }, []);

  const loadPessoas = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await pessoasService.getTodasPessoas();
      setPessoas(fetchedData);
    } catch (error) {
      toast.error('Erro ao carregar pessoas: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (pessoa = null) => {
    setEditingPessoa(pessoa);
    if (pessoa) {
      reset({
        nome: pessoa.nome,
        email: pessoa.email,
        cpf: pessoa.cpf,
        celular: pessoa.celular,
      });
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPessoa(null);
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let result;
      const pessoaData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        celular: data.celular ? data.celular.replace(/\D/g, '') : null,
      };

      if (editingPessoa) {
        const updateData = {
          nome: pessoaData.nome,
          email: pessoaData.email,
          celular: pessoaData.celular,
          papel: editingPessoa.papel,
          statusConta: editingPessoa.statusConta,
        };
        result = await pessoasService.atualizarPessoa(editingPessoa.id, updateData);
      } else {
        result = await pessoasService.criarPessoa(pessoaData);
      }

      if (result.success) {
        toast.success(editingPessoa ? 'Pessoa atualizada com sucesso!' : 'Pessoa cadastrada com sucesso!');
        handleCloseModal();
        loadPessoas();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao salvar pessoa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePerson = (pessoa) => {
    setPersonToDelete(pessoa);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await pessoasService.deletarPessoa(personToDelete.id);
      if (result.success) {
        toast.success('Pessoa excluída com sucesso!');
        setShowDeleteModal(false);
        setPersonToDelete(null);
        loadPessoas();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao excluir pessoa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (pessoa) => {
    try {
      const newStatus = pessoa.statusConta === STATUS_CONTA.ATIVO ? STATUS_CONTA.INATIVO : STATUS_CONTA.ATIVO;
      const updateData = {
        nome: pessoa.nome,
        email: pessoa.email,
        celular: pessoa.celular,
        papel: pessoa.papel,
        statusConta: newStatus,
      };
      
      const result = await pessoasService.atualizarPessoa(pessoa.id, updateData);
      if (result.success) {
        toast.success(`Pessoa ${newStatus === STATUS_CONTA.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
        loadPessoas();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const filteredPessoas = pessoas.filter(pessoa => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.cpf.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || pessoa.statusConta === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (statusConta) => {
    switch (statusConta) {
      case STATUS_CONTA.ATIVO:
        return <Badge bg="success">{STATUS_CONTA.ATIVO}</Badge>;
      case STATUS_CONTA.INATIVO:
        return <Badge bg="secondary">{STATUS_CONTA.INATIVO}</Badge>;
      case STATUS_CONTA.PENDENTE_VALIDACAO:
        return <Badge bg="warning">{STATUS_CONTA.PENDENTE_VALIDACAO}</Badge>;
      default:
        return <Badge bg="light">Desconhecido</Badge>;
    }
  };

  const getPapelBadge = (papel) => {
    switch (papel) {
      case ROLES.ADMIN:
        return <Badge bg="danger">{ROLES.ADMIN}</Badge>;
      case ROLES.SERVIDOR:
        return <Badge bg="info">{ROLES.SERVIDOR}</Badge>;
      case ROLES.RECEPCIONISTA:
        return <Badge bg="warning">{ROLES.RECEPCIONISTA}</Badge>;
      case ROLES.VISITANTE:
        return <Badge bg="primary">{ROLES.VISITANTE}</Badge>;
      default:
        return <Badge bg="light">Desconhecido</Badge>;
    }
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando pessoas..." />;
  }

  return (
    <div className="pessoas-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Pessoas</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-users me-3"></i>
                Gerenciar Pessoas
              </h1>
              <p className="text-muted">
                Cadastro e gerenciamento de pessoas no sistema
              </p>
            </Col>
            <Col xs="auto">
              {canManagePessoas() && (
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="fas fa-plus me-2"></i>
                  Nova Pessoa
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {/* Filtros */}
        <Card className="mb-4">
          <Card.Body>
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
                      placeholder="Nome, email ou CPF..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4} lg={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value={STATUS_CONTA.ATIVO}>Ativos</option>
                    <option value={STATUS_CONTA.INATIVO}>Inativos</option>
                    <option value={STATUS_CONTA.PENDENTE_VALIDACAO}>Pendentes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Button variant="outline-secondary" onClick={loadPessoas}>
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
              Lista de Pessoas ({filteredPessoas.length})
            </h6>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>Status</th>
                    <th>Papel</th>
                    <th>Cadastro</th>
                    <th width="120">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPessoas.map(pessoa => (
                    <tr key={pessoa.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-3">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{pessoa.nome}</div>
                            <div className="text-muted small">ID: {pessoa.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{pessoa.email}</td>
                      <td className="font-monospace">{pessoa.cpf}</td>
                      <td className="font-monospace">{pessoa.celular}</td>
                      <td>{getStatusBadge(pessoa.statusConta)}</td>
                      <td>{getPapelBadge(pessoa.papel)}</td>
                      <td>{pessoa.dataCriacao ? formatDate(pessoa.dataCriacao) : 'N/A'}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="fas fa-ellipsis-v"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOpenModal(pessoa)}>
                              <i className="fas fa-edit me-2"></i>
                              Editar
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => toggleStatus(pessoa)}>
                              <i className={`fas fa-${pessoa.statusConta === STATUS_CONTA.ATIVO ? 'ban' : 'check'} me-2`}></i>
                              {pessoa.statusConta === STATUS_CONTA.ATIVO ? 'Desativar' : 'Ativar'}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              className="text-danger" 
                              onClick={() => handleDeletePerson(pessoa)}
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
              {filteredPessoas.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Nenhuma pessoa encontrada</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user me-2"></i>
              {editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}
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
                      placeholder="email@exemplo.com"
                      {...register('email')}
                      isInvalid={!!errors.email}
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
                      readOnly={!!editingPessoa}
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
              
              {!editingPessoa && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Senha para a nova pessoa"
                      {...register('senha')}
                      isInvalid={!!errors.senha}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.senha?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Papel</Form.Label>
                        <Form.Select
                          {...register('papel')}
                          isInvalid={!!errors.papel}
                        >
                          {Object.values(ROLES).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status da Conta</Form.Label>
                        <Form.Select
                          {...register('statusConta')}
                          isInvalid={!!errors.statusConta}
                        >
                          {Object.values(STATUS_CONTA).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                <i className="fas fa-save me-2"></i>
                {isSubmitting ? 'Salvando...' : editingPessoa ? 'Atualizar' : 'Cadastrar'}
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
          message={`Tem certeza que deseja excluir a pessoa "${personToDelete?.nome}"? Esta ação não pode ser desfeita.`}
          variant="danger"
          isLoading={isSubmitting}
        />
      </Container>
    </div>
  );
};

export default PessoasPage;