// Formatar CPF
export const formatCPF = (value) => {
  if (!value) return '';
  
  const cpf = value.replace(/\D/g, '');
  
  if (cpf.length <= 11) {
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  }
  
  return cpf.slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace (/(\d{3})(\d{1,2})/, '$1-$2');
};


// Formatar telefone/celular
export const formatPhone = (value) => {
  if (!value) return '';
  const phone = value.replace(/\D/g, '');

  if (phone.length <= 10) {
    // Fixo: (99) 9999-9999
    return phone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  // Celular: (99) 99999-9999
  return phone
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

// Remover formatação
export const removeFormatting = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

export const handleCPFInput = (value, onChange) => {
  const numbersOnly = value.replace(/\D/g, '');
  if (numbersOnly.length <= 11) {
    const formatted = formatCPF(numbersOnly);
    onChange(formatted);
    return numbersOnly; // Retorna só os números para validação
  }
};

export const handlePhoneInput = (value, onChange) => {
  const numbersOnly = value.replace(/\D/g, '');
  if (numbersOnly.length <= 11) {
    const formatted = formatPhone(numbersOnly);
    onChange(formatted);
    return numbersOnly; // Retorna só os números para validação
  }
};

// Formatar data
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Formatar data e hora
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  const dt = new Date(dateTime);
  return dt.toLocaleString('pt-BR');
};

// Formatar moeda (Real brasileiro)
export const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatar CEP
export const formatCEP = (value) => {
  if (!value) return '';
  const cep = value.replace(/\D/g, '');
  
  return cep.replace(/(\d{5})(\d)/, '$1-$2');
};

// Capitalizar primeira letra de cada palavra
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Adicione esta função ao arquivo de formatadores existente

export const formatTime = (time) => {
  if (!time) return '';
  
  // Se já está no formato HH:MM, retorna como está
  if (time.includes(':')) {
    return time;
  }
  
  // Se está em formato de timestamp, converte
  const date = new Date(time);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

export const formatTimeRange = (start, end) => {
  if (!start || !end) return '';
  return `${formatTime(start)} - ${formatTime(end)}`;
};