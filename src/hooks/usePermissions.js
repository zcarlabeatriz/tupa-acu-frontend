import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/utils/constants';

export const usePermissions = () => {
  const { user, hasRole, hasAnyRole } = useAuth();

  // Verificar se é administrador
  const isAdmin = () => hasRole(ROLES.ADMIN);

  // Verificar se é recepcionista
  const isRecepcionista = () => hasRole(ROLES.RECEPCIONISTA);

  // Verificar se é servidor
  const isServidor = () => hasRole(ROLES.SERVIDOR);

  // Verificar se é visitante
  const isVisitante = () => hasRole(ROLES.VISITANTE);

  // Verificar se pode gerenciar pessoas
  const canManagePessoas = () => isAdmin();

  // Verificar se pode gerenciar servidores
  const canManageServidores = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA]);

  // Verificar se pode gerenciar organograma
  const canManageOrganograma = () => isAdmin();

  // Verificar se pode gerenciar visitas
  const canManageVisitas = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR]);

  // Verificar se pode agendar visitas
  const canScheduleVisitas = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR, ROLES.VISITANTE]);

  // Verificar se pode controlar recepção
  const canControlRecepcao = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA]);

  // Verificar se pode gerenciar horários
  const canManageHorarios = () => isAdmin();

  // Verificar se pode ver dashboard
  const canViewDashboard = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR]);

  // Verificar se pode ver relatórios
  const canViewReports = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA]);

  // Verificar se pode gerenciar configurações do sistema
  const canManageSettings = () => isAdmin();

  // Verificar se pode ver apenas suas próprias visitas
  const canOnlyViewOwnVisitas = () => isVisitante();

  // Verificar se pode aprovar/rejeitar visitas
  const canApproveVisitas = () => hasAnyRole([ROLES.ADMIN, ROLES.SERVIDOR]);

  // Verificar se pode importar dados do SIGEP
  const canImportSigep = () => isAdmin();

  // === NOVAS PERMISSÕES PARA NOTIFICAÇÕES ===
  
  // Verificar se pode gerenciar notificações (criar, editar, excluir)
  const canManageNotifications = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA]);
  
  // Verificar se pode enviar notificações em massa
  const canSendBulkNotifications = () => isAdmin();
  
  // Verificar se pode receber notificações
  const canReceiveNotifications = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR, ROLES.VISITANTE]);
  
  // Verificar se pode marcar notificações como lidas
  const canMarkNotificationsAsRead = () => hasAnyRole([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR, ROLES.VISITANTE]);

  return {
    user,
    isAdmin,
    isRecepcionista,
    isServidor,
    isVisitante,
    canManagePessoas,
    canManageServidores,
    canManageOrganograma,
    canManageVisitas,
    canScheduleVisitas,
    canControlRecepcao,
    canManageHorarios,
    canViewDashboard,
    canViewReports,
    canManageSettings,
    canOnlyViewOwnVisitas,
    canApproveVisitas,
    canImportSigep,
    // Novas permissões para notificações
    canManageNotifications,
    canSendBulkNotifications,
    canReceiveNotifications,
    canMarkNotificationsAsRead
  };
};