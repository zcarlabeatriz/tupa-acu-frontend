// Constantes do sistema
export const ROLES = {
  ADMIN: 'ADMIN',
  SERVIDOR: 'SERVIDOR',
  RECEPCIONISTA: 'RECEPCIONISTA',
  VISITANTE: 'VISITANTE'
};

export const STATUS_CONTA = {
  ATIVA: 'ATIVA',
  INATIVA: 'INATIVA',
  PENDENTE: 'PENDENTE',
  BLOQUEADA: 'BLOQUEADA'
};

export const SITUACAO_SERVIDOR = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  LICENCA: 'LICENCA',
  FERIAS: 'FERIAS'
};

export const SITUACAO_VISITA = {
  AGENDADA: 'AGENDADA',
  CONFIRMADA: 'CONFIRMADA',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
  RECUSADA: 'RECUSADA'
};

export const DIAS_SEMANA = {
  SEGUNDA: 'SEGUNDA',
  TERCA: 'TERCA',
  QUARTA: 'QUARTA',
  QUINTA: 'QUINTA',
  SEXTA: 'SEXTA',
  SABADO: 'SABADO',
  DOMINGO: 'DOMINGO'
};

export const NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    roles: [ROLES.ADMIN, ROLES.RECEPCIONISTA]
  },
  {
    path: '/pessoas',
    label: 'Pessoas',
    icon: 'fas fa-users',
    roles: [ROLES.ADMIN]
  },
  {
    path: '/servidores',
    label: 'Servidores',
    icon: 'fas fa-user-tie',
    roles: [ROLES.ADMIN, ROLES.RECEPCIONISTA]
  },
  {
    path: '/organograma',
    label: 'Organograma',
    icon: 'fas fa-sitemap',
    roles: [ROLES.ADMIN]
  },
  {
    path: '/visitas',
    label: 'Visitas',
    icon: 'fas fa-calendar-check',
    roles: [ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR]
  },
  {
    path: '/horarios',
    label: 'Horários',
    icon: 'fas fa-clock',
    roles: [ROLES.ADMIN]
  },
  {
    path: '/notifications',
    label: 'Notificações',
    icon: 'fas fa-bell',
    roles: [ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR, ROLES.VISITANTE]
  }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  PESSOAS: '/pessoas',
  SERVIDORES: '/servidores',
  ORGANOGRAMA: '/organograma',
  VISITAS: '/visitas',
  HORARIOS: '/horarios'
};

export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Registro criado com sucesso!',
    UPDATE: 'Registro atualizado com sucesso!',
    DELETE: 'Registro excluído com sucesso!',
    LOGIN: 'Login realizado com sucesso!'
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Acesso não autorizado.',
    NOT_FOUND: 'Registro não encontrado.',
    VALIDATION: 'Verifique os dados informados.'
  },
  CONFIRM: {
    DELETE: 'Tem certeza que deseja excluir este registro?',
    CANCEL: 'Tem certeza que deseja cancelar esta operação?'
  }
};


// SÓ PARA TESTAR
export const STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  SUSPENSO: 'suspenso'
};

export const VISIT_STATUS = {
  PENDENTE: 'pendente',
  APROVADA: 'aprovada',
  REJEITADA: 'rejeitada',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada'
};

export const VISIT_STATUS_LABELS = {
  [VISIT_STATUS.PENDENTE]: 'Pendente',
  [VISIT_STATUS.APROVADA]: 'Aprovada',
  [VISIT_STATUS.REJEITADA]: 'Rejeitada',
  [VISIT_STATUS.CONCLUIDA]: 'Concluída',
  [VISIT_STATUS.CANCELADA]: 'Cancelada'
};


export const NOTIFICATION_TYPES = {
  VISITA_AGENDADA: 'visita_agendada',
  VISITA_APROVADA: 'visita_aprovada',
  VISITA_REJEITADA: 'visita_rejeitada',
  VISITA_CANCELADA: 'visita_cancelada',
  LEMBRETE_VISITA: 'lembrete_visita',
  SISTEMA: 'sistema',
  MANUTENCAO: 'manutencao',
  ANIVERSARIO: 'aniversario',
  REUNIAO: 'reuniao'
};

export const NOTIFICATION_PRIORITIES = {
  BAIXA: 'baixa',
  NORMAL: 'normal',
  ALTA: 'alta',
  CRITICA: 'critica'
};