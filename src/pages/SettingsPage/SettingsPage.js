import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, 
  Breadcrumb, Tab, Tabs, Badge, Table, Modal 
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Loading from '../../components/common/Loading/Loading';
// import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [isLoading, setIsLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'SISREC',
    siteDescription: 'Sistema de Recepção - SEDUC/MA',
    maxVisitorsPerDay: 50,
    defaultVisitDuration: 60,
    requireApproval: true,
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@seduc.ma.gov.br',
    fromName: 'SISREC - SEDUC/MA'
  });
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  // Dados mock para logs do sistema
  const [systemLogs] = useState([
    {
      id: 1,
      timestamp: '2024-08-04 02:10:00',
      level: 'INFO',
      message: 'Usuário admin logou no sistema',
      user: 'admin@seduc.ma.gov.br',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-08-04 02:05:00',
      level: 'WARNING',
      message: 'Tentativa de login falhada',
      user: 'unknown@test.com',
      ip: '192.168.1.200'
    },
    {
      id: 3,
      timestamp: '2024-08-04 02:00:00',
      level: 'INFO',
      message: 'Nova visita agendada por João Silva',
      user: 'joao@email.com',
      ip: '192.168.1.150'
    },
    {
      id: 4,
      timestamp: '2024-08-04 01:55:00',
      level: 'ERROR',
      message: 'Erro ao enviar email de notificação',
      user: 'system',
      ip: 'localhost'
    }
  ]);

  // Verificar se o usuário tem permissão para acessar configurações
  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Você não tem permissão para acessar as configurações do sistema.');
    }
  }, [isAdmin]);

  const handleSystemSettingsChange = (field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailSettingsChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSystemSettings = async () => {
    setIsLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configurações do sistema salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações do sistema.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    setIsLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configurações de email salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de email.');
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async () => {
    if (!testEmailAddress) {
      toast.error('Por favor, digite um endereço de email para teste.');
      return;
    }

    setIsLoading(true);
    try {
      // Simular teste de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Email de teste enviado com sucesso!');
      setShowTestEmail(false);
      setTestEmailAddress('');
    } catch (error) {
      toast.error('Erro ao enviar email de teste. Verifique as configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSystemLogs = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os logs do sistema?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Logs do sistema limpos com sucesso!');
      } catch (error) {
        toast.error('Erro ao limpar logs do sistema.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportSystemLogs = () => {
    // Simular export de logs
    const dataStr = JSON.stringify(systemLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sisrec-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Logs exportados com sucesso!');
  };

  const getLogLevelBadge = (level) => {
    const variants = {
      'INFO': 'info',
      'WARNING': 'warning',
      'ERROR': 'danger',
      'DEBUG': 'secondary'
    };
    return variants[level] || 'secondary';
  };

  if (!isAdmin()) {
    return (
      <Container fluid>
        <Alert variant="danger" className="text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Você não tem permissão para acessar esta página.
        </Alert>
      </Container>
    );
  }

  return (
    <div className="settings-page">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Configurações</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="page-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-cog me-3"></i>
                Configurações do Sistema
              </h1>
              <p className="text-muted">
                Gerencie as configurações gerais do SISREC
              </p>
            </Col>
          </Row>
        </div>

        {/* Conteúdo principal */}
        <Card className="settings-card">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="settings-tabs"
            >
              {/* Tab: Configurações do Sistema */}
              <Tab eventKey="system" title={<><i className="fas fa-cogs me-2"></i>Sistema</>}>
                <div className="tab-content-wrapper">
                  <Row>
                    <Col lg={8}>
                      <h5 className="section-title">Configurações Gerais</h5>
                      
                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nome do Sistema</Form.Label>
                              <Form.Control
                                type="text"
                                value={systemSettings.siteName}
                                onChange={(e) => handleSystemSettingsChange('siteName', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Descrição</Form.Label>
                              <Form.Control
                                type="text"
                                value={systemSettings.siteDescription}
                                onChange={(e) => handleSystemSettingsChange('siteDescription', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Máximo de Visitantes por Dia</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                max="1000"
                                value={systemSettings.maxVisitorsPerDay}
                                onChange={(e) => handleSystemSettingsChange('maxVisitorsPerDay', parseInt(e.target.value))}
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Duração Padrão da Visita (minutos)</Form.Label>
                              <Form.Control
                                type="number"
                                min="15"
                                max="480"
                                step="15"
                                value={systemSettings.defaultVisitDuration}
                                onChange={(e) => handleSystemSettingsChange('defaultVisitDuration', parseInt(e.target.value))}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <h5 className="section-title">Configurações de Visitas</h5>
                        
                        <div className="settings-switches">
                          <Form.Check
                            type="switch"
                            id="require-approval"
                            label="Exigir aprovação para visitas"
                            checked={systemSettings.requireApproval}
                            onChange={(e) => handleSystemSettingsChange('requireApproval', e.target.checked)}
                            className="mb-3"
                          />
                          
                          <Form.Check
                            type="switch"
                            id="enable-notifications"
                            label="Habilitar notificações do sistema"
                            checked={systemSettings.enableNotifications}
                            onChange={(e) => handleSystemSettingsChange('enableNotifications', e.target.checked)}
                            className="mb-3"
                          />
                          
                          <Form.Check
                            type="switch"
                            id="enable-email-alerts"
                            label="Habilitar alertas por email"
                            checked={systemSettings.enableEmailAlerts}
                            onChange={(e) => handleSystemSettingsChange('enableEmailAlerts', e.target.checked)}
                            className="mb-3"
                          />
                        </div>

                        <h5 className="section-title">Modo de Manutenção</h5>
                        
                        <Alert variant={systemSettings.maintenanceMode ? 'warning' : 'info'}>
                          <Form.Check
                            type="switch"
                            id="maintenance-mode"
                            label="Ativar modo de manutenção"
                            checked={systemSettings.maintenanceMode}
                            onChange={(e) => handleSystemSettingsChange('maintenanceMode', e.target.checked)}
                          />
                          <small className="d-block mt-2">
                            {systemSettings.maintenanceMode 
                              ? 'O sistema estará indisponível para usuários não administradores.'
                              : 'O sistema está funcionando normalmente.'
                            }
                          </small>
                        </Alert>

                        <div className="form-actions">
                          <Button
                            variant="primary"
                            onClick={saveSystemSettings}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Salvando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Salvar Configurações
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </Tab>

              {/* Tab: Configurações de Email */}
              <Tab eventKey="email" title={<><i className="fas fa-envelope me-2"></i>Email</>}>
                <div className="tab-content-wrapper">
                  <Row>
                    <Col lg={8}>
                      <h5 className="section-title">Configurações SMTP</h5>
                      
                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Servidor SMTP</Form.Label>
                              <Form.Control
                                type="text"
                                value={emailSettings.smtpHost}
                                onChange={(e) => handleEmailSettingsChange('smtpHost', e.target.value)}
                                placeholder="smtp.gmail.com"
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Porta SMTP</Form.Label>
                              <Form.Control
                                type="number"
                                value={emailSettings.smtpPort}
                                onChange={(e) => handleEmailSettingsChange('smtpPort', parseInt(e.target.value))}
                                placeholder="587"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Usuário SMTP</Form.Label>
                              <Form.Control
                                type="email"
                                value={emailSettings.smtpUser}
                                onChange={(e) => handleEmailSettingsChange('smtpUser', e.target.value)}
                                placeholder="usuario@gmail.com"
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Senha SMTP</Form.Label>
                              <Form.Control
                                type="password"
                                value={emailSettings.smtpPassword}
                                onChange={(e) => handleEmailSettingsChange('smtpPassword', e.target.value)}
                                placeholder="••••••••"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <h5 className="section-title">Configurações de Envio</h5>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Remetente</Form.Label>
                              <Form.Control
                                type="email"
                                value={emailSettings.fromEmail}
                                onChange={(e) => handleEmailSettingsChange('fromEmail', e.target.value)}
                                placeholder="noreply@seduc.ma.gov.br"
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nome do Remetente</Form.Label>
                              <Form.Control
                                type="text"
                                value={emailSettings.fromName}
                                onChange={(e) => handleEmailSettingsChange('fromName', e.target.value)}
                                placeholder="SISREC - SEDUC/MA"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="form-actions">
                          <Button
                            variant="primary"
                            onClick={saveEmailSettings}
                            disabled={isLoading}
                            className="me-3"
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Salvando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Salvar Configurações
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="outline-primary"
                            onClick={() => setShowTestEmail(true)}
                          >
                            <i className="fas fa-paper-plane me-2"></i>
                            Testar Email
                          </Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </Tab>

              {/* Tab: Logs do Sistema */}
              <Tab eventKey="logs" title={<><i className="fas fa-list-alt me-2"></i>Logs</>}>
                <div className="tab-content-wrapper">
                  <div className="logs-header">
                    <Row className="align-items-center">
                      <Col>
                        <h5 className="section-title">Logs do Sistema</h5>
                        <p className="text-muted">
                          Visualize e gerencie os logs de atividade do sistema
                        </p>
                      </Col>
                      <Col xs="auto">
                        <div className="logs-actions">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={exportSystemLogs}
                            className="me-2"
                          >
                            <i className="fas fa-download me-1"></i>
                            Exportar
                          </Button>
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={clearSystemLogs}
                            disabled={isLoading}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Limpar
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="logs-table-container">
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Nível</th>
                          <th>Mensagem</th>
                          <th>Usuário</th>
                          <th>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemLogs.map(log => (
                          <tr key={log.id}>
                            <td>
                              <small className="text-muted">
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                              </small>
                            </td>
                            <td>
                              <Badge bg={getLogLevelBadge(log.level)}>
                                {log.level}
                              </Badge>
                            </td>
                            <td>{log.message}</td>
                            <td>
                              <small>{log.user}</small>
                            </td>
                            <td>
                              <small className="text-muted">{log.ip}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {systemLogs.length === 0 && (
                    <Alert variant="info" className="text-center">
                      <i className="fas fa-info-circle me-2"></i>
                      Nenhum log encontrado.
                    </Alert>
                  )}
                </div>
              </Tab>

              {/* Tab: Informações do Sistema */}
              <Tab eventKey="info" title={<><i className="fas fa-info-circle me-2"></i>Sistema</>}>
                <div className="tab-content-wrapper">
                  <Row>
                    <Col lg={6}>
                      <Card className="info-card">
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-server me-2"></i>
                            Informações do Sistema
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="info-item">
                            <span className="info-label">Versão:</span>
                            <span className="info-value">1.0.0</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ambiente:</span>
                            <span className="info-value">Produção</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Última atualização:</span>
                            <span className="info-value">04/08/2024</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Desenvolvedor:</span>
                            <span className="info-value">SEDUC/MA</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col lg={6}>
                      <Card className="info-card">
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-database me-2"></i>
                            Estatísticas do Banco
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="info-item">
                            <span className="info-label">Total de usuários:</span>
                            <span className="info-value">127</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Visitas registradas:</span>
                            <span className="info-value">1,543</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Servidores ativos:</span>
                            <span className="info-value">45</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Tamanho do banco:</span>
                            <span className="info-value">25.4 MB</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>

      {/* Modal para teste de email */}
      <Modal show={showTestEmail} onHide={() => setShowTestEmail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-paper-plane me-2"></i>
            Testar Configurações de Email
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Digite um endereço de email para enviar um email de teste e verificar se as configurações estão funcionando corretamente.
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label>Email de destino</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite o email para teste"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={testEmailConnection}
              disabled={isLoading || !testEmailAddress}
              className="flex-fill"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Enviar Teste
                </>
              )}
            </Button>
            
            <Button
              variant="outline-secondary"
              onClick={() => setShowTestEmail(false)}
              className="flex-fill"
            >
              Cancelar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SettingsPage;