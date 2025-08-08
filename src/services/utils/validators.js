import * as yup from 'yup';
import {ROLES, NOTIFICATION_TYPES} from './constants';

// Schema de validação para login
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória')
});

// Schema de validação para registro
export const registerSchema = yup.object({
  nome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('senha'), null], 'Senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
  cpf: yup
    .string()
    .matches(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .required('CPF é obrigatório'),
  celular: yup
    .string()
    .required('Celular é obrigatório')
    .test('phone-format', 'Celular deve ter pelo menos 10 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    })
});

// Schema de validação para pessoas
export const pessoaSchema = yup.object({
  nome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .required('Nome é obrigatório'),
  
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('cpf-format', 'CPF deve ter 11 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length === 11;
    })
    .test('cpf-valid', 'CPF inválido', function(value) {
      if (!value) return false;
      return validateCPF(value);
    }),
  
  celular: yup
    .string()
    .required('Celular é obrigatório')
    .test('phone-format', 'Celular deve ter pelo menos 10 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }),
    
  endereco: yup
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
});

// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false;
  }
  
  const cpfArray = cpf.split('').map(el => +el);
  const rest = (count) => {
    return (cpfArray.slice(0, count-12 + count).reduce((soma, el, index) => (soma + el * (count-index)), 0) * 10) % 11 % 10;
  };
  
  return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
};

// Adicione este schema ao arquivo de validadores existente

export const servidorSchema = yup.object({
  nome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .required('Nome é obrigatório'),
  
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('cpf-format', 'CPF deve ter 11 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length === 11;
    })
    .test('cpf-valid', 'CPF inválido', function(value) {
      if (!value) return false;
      return validateCPF(value);
    }),
  
  celular: yup
    .string()
    .required('Celular é obrigatório')
    .test('phone-format', 'Celular deve ter pelo menos 10 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }),
    
  matricula: yup
    .string()
    .min(3, 'Matrícula deve ter pelo menos 3 caracteres')
    .max(20, 'Matrícula deve ter no máximo 20 caracteres')
    .required('Matrícula é obrigatória'),
    
  cargo: yup
    .string()
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(100, 'Cargo deve ter no máximo 100 caracteres')
    .required('Cargo é obrigatório'),
    
  setorId: yup
    .string()
    .required('Setor é obrigatório'),
    
  papel: yup
    .string()
    .oneOf([ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.SERVIDOR], 'Papel inválido')
    .required('Papel é obrigatório'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
});

// Adicione este schema ao arquivo de validadores existente

export const setorSchema = yup.object({
  nome: yup
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  
  sigla: yup
    .string()
    .min(2, 'Sigla deve ter pelo menos 2 caracteres')
    .max(10, 'Sigla deve ter no máximo 10 caracteres')
    .matches(/^[A-Z0-9]+$/, 'Sigla deve conter apenas letras maiúsculas e números')
    .required('Sigla é obrigatória'),
  
  descricao: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .required('Descrição é obrigatória'),
    
  setorPaiId: yup
    .string()
    .nullable(),
    
  responsavel: yup
    .string()
    .min(2, 'Nome do responsável deve ter pelo menos 2 caracteres')
    .max(150, 'Nome do responsável deve ter no máximo 150 caracteres')
    .required('Responsável é obrigatório'),
    
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
    
  telefone: yup
    .string()
    .required('Telefone é obrigatório')
    .test('phone-format', 'Telefone deve ter pelo menos 10 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }),
    
  localizacao: yup
    .string()
    .max(200, 'Localização deve ter no máximo 200 caracteres'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
});

export const visitaSchema = yup.object({
  visitanteNome: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .required('Nome do visitante é obrigatório'),
  
  visitanteEmail: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email do visitante é obrigatório'),
  
  visitanteCpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('cpf-format', 'CPF deve ter 11 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length === 11;
    })
    .test('cpf-valid', 'CPF inválido', function(value) {
      if (!value) return false;
      return validateCPF(value);
    }),
  
  visitanteCelular: yup
    .string()
    .required('Celular é obrigatório')
    .test('phone-format', 'Celular deve ter pelo menos 10 dígitos', function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }),
    
  visitanteEmpresa: yup
    .string()
    .max(200, 'Nome da empresa deve ter no máximo 200 caracteres'),
    
  servidorId: yup
    .string()
    .required('Servidor é obrigatório'),
    
  dataVisita: yup
    .string()
    .required('Data da visita é obrigatória')
    .test('future-date', 'Data deve ser hoje ou no futuro', function(value) {
      if (!value) return false;
      const today = new Date().toISOString().split('T')[0];
      return value >= today;
    }),
    
  horaInicio: yup
    .string()
    .required('Hora de início é obrigatória'),
    
  horaFim: yup
    .string()
    .required('Hora de fim é obrigatória')
    .test('time-after', 'Hora de fim deve ser posterior à hora de início', function(value) {
      const { horaInicio } = this.parent;
      if (!value || !horaInicio) return true;
      return value > horaInicio;
    }),
    
  motivo: yup
    .string()
    .min(10, 'Motivo deve ter pelo menos 10 caracteres')
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .required('Motivo é obrigatório'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
});

// Adicione estes schemas ao arquivo de validadores existente

export const horarioSchema = yup.object({
  nome: yup
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  
  descricao: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    
  setorId: yup
    .string()
    .required('Setor é obrigatório'),
    
  diasSemana: yup
    .array()
    .of(yup.number())
    .min(1, 'Selecione pelo menos um dia da semana')
    .required('Dias da semana são obrigatórios'),
    
  horaInicio: yup
    .string()
    .required('Hora de início é obrigatória'),
    
  horaFim: yup
    .string()
    .required('Hora de fim é obrigatória')
    .test('time-after', 'Hora de fim deve ser posterior à hora de início', function(value) {
      const { horaInicio } = this.parent;
      if (!value || !horaInicio) return true;
      return value > horaInicio;
    }),
    
  intervaloMinutos: yup
    .number()
    .min(15, 'Intervalo mínimo é 15 minutos')
    .max(480, 'Intervalo máximo é 8 horas')
    .required('Intervalo é obrigatório'),
    
  maxVisitasPorHorario: yup
    .number()
    .min(1, 'Mínimo 1 visita por horário')
    .max(10, 'Máximo 10 visitas por horário')
    .required('Máximo de visitas é obrigatório'),
    
  antecedenciaMinima: yup
    .number()
    .min(1, 'Antecedência mínima é 1 hora')
    .required('Antecedência mínima é obrigatória'),
    
  antecedenciaMaxima: yup
    .number()
    .min(24, 'Antecedência máxima é no mínimo 24 horas')
    .test('greater-than-min', 'Antecedência máxima deve ser maior que a mínima', function(value) {
      const { antecedenciaMinima } = this.parent;
      if (!value || !antecedenciaMinima) return true;
      return value > antecedenciaMinima;
    })
    .required('Antecedência máxima é obrigatória'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres'),
    
  ativo: yup
    .boolean()
});

export const bloqueioSchema = yup.object({
  titulo: yup
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .required('Título é obrigatório'),
  
  descricao: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    
  dataInicio: yup
    .string()
    .required('Data de início é obrigatória')
    .test('future-date', 'Data deve ser hoje ou no futuro', function(value) {
      if (!value) return false;
      const today = new Date().toISOString().split('T')[0];
      return value >= today;
    }),
    
  dataFim: yup
    .string()
    .required('Data de fim é obrigatória')
    .test('date-after', 'Data de fim deve ser posterior ou igual à data de início', function(value) {
      const { dataInicio } = this.parent;
      if (!value || !dataInicio) return true;
      return value >= dataInicio;
    }),
    
  horaInicio: yup
    .string()
    .required('Hora de início é obrigatória'),
    
  horaFim: yup
    .string()
    .required('Hora de fim é obrigatória')
    .test('time-after', 'Hora de fim deve ser posterior à hora de início', function(value) {
      const { horaInicio, dataInicio, dataFim } = this.parent;
      if (!value || !horaInicio) return true;
      
      // Se for o mesmo dia, hora fim deve ser posterior
      if (dataInicio === dataFim) {
        return value > horaInicio;
      }
      
      // Se for dias diferentes, qualquer hora é válida
      return true;
    }),
    
  setorId: yup
    .string()
    .nullable(),
    
  tipoRecorrencia: yup
    .string()
    .oneOf(['nenhuma', 'diaria', 'semanal', 'mensal', 'anual'], 'Tipo de recorrência inválido')
    .required('Tipo de recorrência é obrigatório'),
    
  observacoes: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
});

// Adicione este schema ao arquivo de validadores existente

export const notificacaoSchema = yup.object({
  titulo: yup
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .required('Título é obrigatório'),
  
  mensagem: yup
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
    .required('Mensagem é obrigatória'),
    
  tipo: yup
    .string()
    .oneOf(Object.values(NOTIFICATION_TYPES), 'Tipo de notificação inválido')
    .required('Tipo é obrigatório'),
    
  destinatarios: yup
    .array()
    .of(yup.string())
    .min(1, 'Selecione pelo menos um destinatário')
    .required('Destinatários são obrigatórios'),
    
  dataEnvio: yup
    .string()
    .test('future-date', 'Data deve ser hoje ou no futuro', function(value) {
      if (!value) return true; // Campo opcional
      const today = new Date().toISOString().split('T')[0];
      return value >= today;
    }),
    
  horaEnvio: yup
    .string(),
    
  prioridade: yup
    .string()
    .oneOf(['baixa', 'normal', 'alta', 'critica'], 'Prioridade inválida')
    .required('Prioridade é obrigatória'),
    
  enviarEmail: yup
    .boolean(),
    
  expirarEm: yup
    .string()
    .test('future-datetime', 'Data de expiração deve ser no futuro', function(value) {
      if (!value) return true; // Campo opcional
      return new Date(value) > new Date();
    })
});