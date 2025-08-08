import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// import { pessoasService } from '../../services/api/pessoasService';
import { pessoaSchema } from '../../services/utils/validators';
import { formatPhone, formatCPF } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import './PessoasPage.css';

const PessoasPage = () => {
  const [pessoas, setPessoas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  
  const { user } = useAuth();
  const { canManagePessoas } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(pessoaSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      celular: '',
      endereco: '',
      observacoes: ''
    }
  });

  // Formatação automática dos campos
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
      // Simulação de dados - substitua pela chamada real da API
      const mockData = [
        {
          id: 1,
          nome: 'João Silva Santos',
          email: 'joao.silva@email.com',
          cpf: '123.456.789-01',
          celular: '(98) 98765-4321',
          endereco: 'Rua A, 123 - Centro',
          status: 'ativo',
          dataCadastro: '2024-01-15',
          ultimaVisita: '2024-08-01',
          totalVisitas: 5
        },
        {
          id: 2,
          nome: 'Maria Oliveira Costa',
          email: 'maria.oliveira@email.com',
          cpf: '987.654.321-09',
          celular: '(98) 99876-5432',
          endereco: 'Av. B, 456 - Cohama',
          status: 'ativo',
          dataCadastro: '2024-02-20',
          ultimaVisita: '2024-07-28',
          totalVisitas: 3
        },
        {
          id: 3,
          nome: 'Carlos Souza Lima',
          email: 'carlos.souza@email.com',
          cpf: '456.789.123-45',
          celular: '(98) 97654-3210',
          endereco: 'Rua C, 789 - Calhau',
          status: 'inativo',
          dataCadastro: '2024-03-10',
          ultimaVisita: '2024-06-15',
          totalVisitas: 1
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setPessoas(mockData);
    } catch (error) {
      toast.error('Erro ao carregar pessoas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (pessoa = null) => {
    setEditingPessoa(pessoa);
    if (pessoa) {
      setValue('nome', pessoa.nome);
      setValue('email', pessoa.email);
      setValue('cpf', pessoa.cpf);
      setValue('celular', pessoa.celular);
      setValue('endereco', pessoa.endereco || '');
      setValue('observacoes', pessoa.observacoes || '');
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
    try {
      if (editingPessoa) {
        // Atualizar pessoa existente
        toast.success('Pessoa atualizada com sucesso!');
      } else {
        // Criar nova pessoa
        toast.success('Pessoa cadastrada com sucesso!');
      }
      handleCloseModal();
      loadPessoas();
    } catch (error) {
      toast.error('Erro ao salvar pessoa');
    }
  };

  const handleDeletePerson = (pessoa) => {
    setPersonToDelete(pessoa);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Chamada para API de exclusão
      toast.success('Pessoa excluída com sucesso!');
      setShowDeleteModal(false);
      setPersonToDelete(null);
      loadPessoas();
    } catch (error) {
      toast.error('Erro ao excluir pessoa');
    }
  };

  const toggleStatus = async (pessoa) => {
    try {
      const newStatus = pessoa.status === 'ativo' ? 'inativo' : 'ativo';
      // Chamada para API de atualização de status
      toast.success(`Pessoa ${newStatus === 'ativo' ? 'ativada' : 'desativada'} com sucesso!`);
      loadPessoas();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  // Filtrar pessoas
  const filteredPessoas = pessoas.filter(pessoa => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.cpf.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || pessoa.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    return status === 'ativo' ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
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
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
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
                    <th>Visitas</th>
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
                      <td>{getStatusBadge(pessoa.status)}</td>
                      <td>
                        <span className="fw-bold">{pessoa.totalVisitas}</span>
                        <div className="text-muted small">
                          Última: {new Date(pessoa.ultimaVisita).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>{new Date(pessoa.dataCadastro).toLocaleDateString('pt-BR')}</td>
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
                              <i className={`fas fa-${pessoa.status === 'ativo' ? 'ban' : 'check'} me-2`}></i>
                              {pessoa.status === 'ativo' ? 'Desativar' : 'Ativar'}
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
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Endereço completo"
                  {...register('endereco')}
                  isInvalid={!!errors.endereco}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endereco?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observações adicionais..."
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
                {editingPessoa ? 'Atualizar' : 'Cadastrar'}
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
        />
      </Container>
    </div>
  );
};

export default PessoasPage;