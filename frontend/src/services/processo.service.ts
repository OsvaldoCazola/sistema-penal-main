import api from '@/lib/api';
import type { Processo, ProcessoSummary, Page, Movimentacao, StatusProcesso, TimelineResponse } from '@/types';

export interface ProcessoFilters {
  status?: StatusProcesso;
  tribunalId?: string;
  inicio?: string;
  fim?: string;
  page?: number;
  size?: number;
}

export const processoService = {
  async listar(filters: ProcessoFilters = {}): Promise<Page<ProcessoSummary>> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.tribunalId) params.append('tribunalId', filters.tribunalId);
    if (filters.inicio) params.append('inicio', filters.inicio);
    if (filters.fim) params.append('fim', filters.fim);
    params.append('page', String(filters.page || 0));
    params.append('size', String(filters.size || 20));

    const response = await api.get<Page<ProcessoSummary>>(`/processos?${params}`);
    return response.data;
  },

  async buscarPorId(id: string): Promise<Processo> {
    const response = await api.get<Processo>(`/processos/${id}`);
    return response.data;
  },

  async buscarPorNumero(numero: string): Promise<Processo> {
    const response = await api.get<Processo>(`/processos/numero/${encodeURIComponent(numero)}`);
    return response.data;
  },

  async criar(data: {
    numero: string;
    tribunalId?: string;
    tipoCrimeId?: string;
    dataAbertura: string;
    dataFato?: string | null;
    descricaoFatos?: string | null;
    localFato?: string | null;
    provincia?: string;
    fase?: string;
    partes?: Array<{
      tipo: string;
      nome: string;
      documento?: string;
      tipoDocumento?: string;
      endereco?: string;
    }>;
    metadata?: Record<string, unknown>;
  }): Promise<Processo> {
    const response = await api.post<Processo>('/processos', data);
    return response.data;
  },

  async atualizar(id: string, data: Partial<Processo>): Promise<Processo> {
    const response = await api.put<Processo>(`/processos/${id}`, data);
    return response.data;
  },

  async alterarStatus(id: string, status: StatusProcesso): Promise<void> {
    await api.patch(`/processos/${id}/status?status=${status}`);
  },

  async listarMovimentacoes(id: string, page = 0): Promise<Page<Movimentacao>> {
    const response = await api.get<Page<Movimentacao>>(
      `/processos/${id}/movimentacoes?page=${page}`
    );
    return response.data;
  },

  async adicionarMovimentacao(id: string, data: Partial<Movimentacao>): Promise<Movimentacao> {
    const response = await api.post<Movimentacao>(`/processos/${id}/movimentacoes`, data);
    return response.data;
  },

  async estatisticas(): Promise<Record<string, number>> {
    const response = await api.get<Record<string, number>>('/processos/estatisticas');
    return response.data;
  },

  async buscarTimeline(processoId: string): Promise<TimelineResponse> {
    const response = await api.get<TimelineResponse>(`/processos/${processoId}/timeline`);
    return response.data;
  },

  async buscarEstatisticasTimeline(processoId: string): Promise<Record<string, any>> {
    const response = await api.get<Record<string, any>>(`/processos/${processoId}/timeline/estatisticas`);
    return response.data;
  },
};
