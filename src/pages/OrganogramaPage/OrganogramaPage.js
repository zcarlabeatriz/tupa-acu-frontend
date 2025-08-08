import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge, Dropdown, Breadcrumb, Alert, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// import { organogramaService } from '../../services/api/organogramaService';
import { setorSchema } from '../../services/utils/validators';
// import { formatDate, formatDateTime } from '../../services/utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import OrganogramaTree from '../../components/organograma/OrganogramaTree/OrganogramaTree';
import './OrganogramaPage.css';

const OrganogramaPage = () => {
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetor, setEditingSetor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setorToDelete, setSetorToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('lista');
  const [treeData, setTreeData] = useState([]);
  
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(setorSchema),
    defaultValues: {
      nome: '',
      sigla: '',
      descricao: '',
      setorPaiId: '',
      responsavel: '',
      email: '',
      telefone: '',
      localizacao: '',
      observacoes: ''
    }
  });

  useEffect(() => {
    loadSetores();
  }, []);

  const loadSetores = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - substitua pelas chamadas reais da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSetores = [
        {
          id: 1,
          nome: 'Gabinete do Secretário',
          sigla: 'GAB',
          descricao: 'Gabinete principal da Secretaria de Educação',
          setorPaiId: null,
          responsavel: 'Maria José da Silva',
          email: 'gabinete@seduc.ma.gov.br',
          telefone: '(98) 3131-0001',
          localizacao: 'Andar 5 - Sala 501',
          status: 'ativo',
          dataCriacao: '2024-01-01T08:00:00Z',
          totalServidores: 8,
          totalSubsetores: 3,
          observacoes: 'Setor principal da secretaria'
        },
        {
          id: 2,
          nome: 'Superintendência de Recursos Humanos',
          sigla: 'SURH',
          descricao: 'Gestão de pessoal e recursos humanos',
          setorPaiId: 1,
          responsavel: 'João Carlos Santos',
          email: 'rh@seduc.ma.gov.br',
          telefone: '(98) 3131-0002',
          localizacao: 'Andar 3 - Salas 301-310',
          status: 'ativo',
          dataCriacao: '2024-01-15T09:00:00Z',
          totalServidores: 15,
          totalSubsetores: 2,
          observacoes: ''
        },
        {
          id: 3,
          nome: 'Departamento de Folha de Pagamento',
          sigla: 'DFP',
          descricao: 'Processamento da folha de pagamento',
          setorPaiId: 2,
          responsavel: 'Ana Paula Lima',
          email: 'folha@seduc.ma.gov.br',
          telefone: '(98) 3131-0003',
          localizacao: 'Andar 3 - Sala 305',
          status: 'ativo',
          dataCriacao: '2024-01-20T10:00:00Z',
          totalServidores: 6,
          totalSubsetores: 0,
          observacoes: ''
        },
        {
          id: 4,
          nome: 'Departamento de Administração de Pessoal',
          sigla: 'DAP',
          descricao: 'Administração e controle de pessoal',
          setorPaiId: 2,
          responsavel: 'Carlos Eduardo Rocha',
          email: 'pessoal@seduc.ma.gov.br',
          telefone: '(98) 3131-0004',
          localizacao: 'Andar 3 - Sala 308',
          status: 'ativo',
          dataCriacao: '2024-01-25T11:00:00Z',
          totalServidores: 9,
          totalSubsetores: 0,
          observacoes: ''
        },
        {
          id: 5,
          nome: 'Superintendência de Tecnologia',
          sigla: 'SUTEC',
          descricao: 'Tecnologia da informação e comunicação',
          setorPaiId: 1,
          responsavel: 'Fernando Silva Costa',
          email: 'ti@seduc.ma.gov.br',
          telefone: '(98) 3131-0005',
          localizacao: 'Andar 2 - Salas 201-205',
          status: 'ativo',
          dataCriacao: '2024-02-01T08:30:00Z',
          totalServidores: 12,
          totalSubsetores: 1,
          observacoes: 'Setor responsável por toda infraestrutura tecnológica'
        },
        {
          id: 6,
          nome: 'Núcleo de Desenvolvimento de Sistemas',
          sigla: 'NDS',
          descricao: 'Desenvolvimento e manutenção de sistemas',
          setorPaiId: 5,
          responsavel: 'Rafael Mendes Oliveira',
          email: 'sistemas@seduc.ma.gov.br',
          telefone: '(98) 3131-0006',
          localizacao: 'Andar 2 - Sala 203',
          status: 'ativo',
          dataCriacao: '2024-02-10T09:15:00Z',
          totalServidores: 8,
          totalSubsetores: 0,
          observacoes: ''
        },
        {
          id: 7,
          nome: 'Superintendência Financeira',
          sigla: 'SUFIN',
          descricao: 'Gestão financeira e orçamentária',
          setorPaiId: 1,
          responsavel: 'Luciana Pereira Santos',
          email: 'financeiro@seduc.ma.gov.br',
          telefone: '(98) 3131-0007',
          localizacao: 'Andar 4 - Salas 401-408',
          status: 'ativo',
          dataCriacao: '2024-02-15T10:00:00Z',
          totalServidores: 18,
          totalSubsetores: 0,
          observacoes: ''
        },
        {
          id: 8,
          nome: 'Assessoria Jurídica',
          sigla: 'AJUR',
          descricao: 'Assessoria e consultoria jurídica',
          setorPaiId: null,
          responsavel: 'Dr. Roberto Almeida Filho',
          email: 'juridico@seduc.ma.gov.br',
          telefone: '(98) 3131-0008',
          localizacao: 'Andar 5 - Sala 510',
          status: 'inativo',
          dataCriacao: '2024-03-01T08:00:00Z',
          totalServidores: 4,
          totalSubsetores: 0,
          observacoes: 'Temporariamente desativado para reestruturação'
        }
      ];

      setSetores(mockSetores);
      
      // Criar estrutura em árvore para o organograma
      const tree = buildTreeData(mockSetores);
      setTreeData(tree);
      
    } catch (error) {
      toast.error('Erro ao carregar setores');
    } finally {
      setIsLoading(false);
    }
  };

  const buildTreeData = (setores) => {
    const setorMap = {};
    const roots = [];

    // Criar mapa de setores
    setores.forEach(setor => {
      setorMap[setor.id] = { 
        ...setor, 
        children: [] 
      };
    });

    // Construir árvore
    setores.forEach(setor => {
      if (setor.setorPaiId && setorMap[setor.setorPaiId]) {
        setorMap[setor.setorPaiId].children.push(setorMap[setor.id]);
      } else {
        roots.push(setorMap[setor.id]);
      }
    });

    return roots;
  };

  const handleOpenModal = (setor = null) => {
    setEditingSetor(setor);
    if (setor) {
      setValue('nome', setor.nome);
      setValue('sigla', setor.sigla);
      setValue('descricao', setor.descricao);
      setValue('setorPaiId', setor.setorPaiId || '');
      setValue('responsavel', setor.responsavel);
      setValue('email', setor.email);
      setValue('telefone', setor.telefone);
      setValue('localizacao', setor.localizacao || '');
      setValue('observacoes', setor.observacoes || '');
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSetor(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const setorData = {
        ...data,
        telefone: data.telefone.replace(/\D/g, '')
      };

      if (editingSetor) {
        toast.success('Setor atualizado com sucesso!');
      } else {
        toast.success('Setor cadastrado com sucesso!');
      }
      handleCloseModal();
      loadSetores();
    } catch (error) {
      toast.error('Erro ao salvar setor');
    }
  };

  const handleDeleteSetor = (setor) => {
    if (setor.totalSubsetores > 0) {
      toast.warning('Não é possível excluir um setor que possui subsetores');
      return;
    }
    if (setor.totalServidores > 0) {
      toast.warning('Não é possível excluir um setor que possui servidores');
      return;
    }
    setSetorToDelete(setor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      toast.success('Setor excluído com sucesso!');
      setShowDeleteModal(false);
      setSetorToDelete(null);
      loadSetores();
    } catch (error) {
      toast.error('Erro ao excluir setor');
    }
  };

  const toggleStatus = async (setor) => {
    try {
      const newStatus = setor.status === 'ativo' ? 'inativo' : 'ativo';
      toast.success(`Setor ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
      loadSetores();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  // Filtrar setores
  const filteredSetores = setores.filter(setor => {
    const matchesSearch = setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setor.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setor.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || setor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    return status === 'ativo' ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
  };

  const getSetorHierarchy = (setorId) => {
    const setor = setores.find(s => s.id === setorId);
    if (!setor || !setor.setorPaiId) return '';
    
    const pai = setores.find(s => s.id === setor.setorPaiId);
    return pai ? pai.sigla : '';
  };

  const getSetoresForSelect = () => {
    return setores
      .filter(setor => setor.status === 'ativo')
      .filter(setor => !editingSetor || setor.id !== editingSetor.id);
  };

  if (isLoading) {
    return <Loading fullPage text="Carregando organograma..." />;
  }

  return (
    <div className="organograma-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Organograma</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <i className="fas fa-sitemap me-3"></i>
                Organograma SEDUC/MA
              </h1>
              <p className="text-muted">
                Estrutura organizacional da Secretaria de Estado da Educação
              </p>
            </Col>
            <Col xs="auto">
              {isAdmin() && (
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="fas fa-plus me-2"></i>
                  Novo Setor
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
                  <div className="stat-icon"><i className="fas fa-building"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{setores.length}</h3>
                    <p className="stat-label">Total Setores</p>
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
                    <h3 className="stat-number">{setores.filter(s => s.status === 'ativo').length}</h3>
                    <p className="stat-label">Ativos</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-info">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-users"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{setores.reduce((acc, s) => acc + s.totalServidores, 0)}</h3>
                    <p className="stat-label">Servidores</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card stat-warning">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon"><i className="fas fa-layer-group"></i></div>
                  <div className="stat-details">
                    <h3 className="stat-number">{setores.filter(s => !s.setorPaiId).length}</h3>
                    <p className="stat-label">Setores Raiz</p>
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
              <Tab eventKey="lista" title={<><i className="fas fa-list me-2"></i>Lista</>}>
              </Tab>
              <Tab eventKey="organograma" title={<><i className="fas fa-sitemap me-2"></i>Organograma</>}>
              </Tab>
            </Tabs>
          </Card.Header>
          
          <Card.Body className="p-0">
            {activeTab === 'lista' && (
              <>
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
                            placeholder="Nome, sigla ou responsável..."
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
                      <Button variant="outline-secondary" onClick={loadSetores}>
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
                        <th>Setor</th>
                        <th>Sigla</th>
                        <th>Setor Pai</th>
                        <th>Responsável</th>
                        <th>Contato</th>
                        <th>Servidores</th>
                        <th>Status</th>
                        <th width="120">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSetores.map(setor => (
                        <tr key={setor.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="setor-icon me-3">
                                <i className="fas fa-building"></i>
                              </div>
                              <div>
                                <div className="fw-bold">{setor.nome}</div>
                                <div className="text-muted small">{setor.descricao}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info" className="font-monospace">
                              {setor.sigla}
                            </Badge>
                          </td>
                          <td>
                            {setor.setorPaiId ? (
                              <Badge bg="outline-secondary">
                                {getSetorHierarchy(setor.id)}
                              </Badge>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <div className="fw-bold">{setor.responsavel}</div>
                            <div className="text-muted small">{setor.localizacao}</div>
                          </td>
                          <td>
                            <div className="small">
                              <div><i className="fas fa-envelope me-1"></i> {setor.email}</div>
                              <div><i className="fas fa-phone me-1"></i> {setor.telefone}</div>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <span className="fw-bold d-block">{setor.totalServidores}</span>
                              <small className="text-muted">servidores</small>
                            </div>
                          </td>
                          <td>{getStatusBadge(setor.status)}</td>
                          <td>
                            {isAdmin() && (
                              <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm">
                                  <i className="fas fa-ellipsis-v"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleOpenModal(setor)}>
                                    <i className="fas fa-edit me-2"></i>
                                    Editar
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => toggleStatus(setor)}>
                                    <i className={`fas fa-${setor.status === 'ativo' ? 'ban' : 'check'} me-2`}></i>
                                    {setor.status === 'ativo' ? 'Desativar' : 'Ativar'}
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item 
                                    className="text-danger" 
                                    onClick={() => handleDeleteSetor(setor)}
                                  >
                                    <i className="fas fa-trash me-2"></i>
                                    Excluir
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {filteredSetores.length === 0 && (
                    <div className="text-center py-4">
                      <i className="fas fa-building fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Nenhum setor encontrado</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'organograma' && (
              <div className="organograma-container p-4">
                <OrganogramaTree data={treeData} />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-building me-2"></i>
              {editingSetor ? 'Editar Setor' : 'Novo Setor'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Setor</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Superintendência de Recursos Humanos"
                      {...register('nome')}
                      isInvalid={!!errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sigla</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: SURH"
                      {...register('sigla')}
                      isInvalid={!!errors.sigla}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sigla?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Breve descrição das atividades do setor"
                  {...register('descricao')}
                  isInvalid={!!errors.descricao}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.descricao?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Setor Pai</Form.Label>
                <Form.Select
                  {...register('setorPaiId')}
                  isInvalid={!!errors.setorPaiId}
                >
                  <option value="">Setor raiz (sem hierarquia)</option>
                  {getSetoresForSelect().map(setor => (
                    <option key={setor.id} value={setor.id}>
                      {setor.sigla} - {setor.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.setorPaiId?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Responsável</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome do responsável pelo setor"
                      {...register('responsavel')}
                      isInvalid={!!errors.responsavel}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.responsavel?.message}
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
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="(98) 3131-0000"
                      {...register('telefone')}
                      isInvalid={!!errors.telefone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.telefone?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Localização</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Andar 3 - Sala 301"
                      {...register('localizacao')}
                      isInvalid={!!errors.localizacao}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.localizacao?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Informações adicionais sobre o setor..."
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
                {editingSetor ? 'Atualizar' : 'Cadastrar'}
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
          message={`Tem certeza que deseja excluir o setor "${setorToDelete?.nome}"? Esta ação não pode ser desfeita.`}
          variant="danger"
        />
      </Container>
    </div>
  );
};

export default OrganogramaPage;