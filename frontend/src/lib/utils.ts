import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy') {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm");
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    EM_ANDAMENTO: 'bg-blue-100 text-blue-800',
    AGUARDANDO_AUDIENCIA: 'bg-yellow-100 text-yellow-800',
    EM_JULGAMENTO: 'bg-purple-100 text-purple-800',
    SENTENCIADO: 'bg-green-100 text-green-800',
    EM_RECURSO: 'bg-orange-100 text-orange-800',
    TRANSITADO_JULGADO: 'bg-gray-100 text-gray-800',
    ARQUIVADO: 'bg-gray-100 text-gray-600',
    SUSPENSO: 'bg-red-100 text-red-800',
    RECEBIDA: 'bg-blue-100 text-blue-800',
    EM_ANALISE: 'bg-yellow-100 text-yellow-800',
    ENCAMINHADA: 'bg-purple-100 text-purple-800',
    EM_INVESTIGACAO: 'bg-orange-100 text-orange-800',
    CONCLUIDA: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
