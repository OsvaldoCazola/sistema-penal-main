import api from '@/lib/api';

// Tipos para LawUpdate

export interface LawUpdateRequest {
  tipo: string;
  numero: string;
  ano: number;
  titulo: string;
  descricao?: string;
  urlOriginal?: string;
  fonteOrigem?: string;
}

export interface LawUpdateResponse {
  id: string;
  tipo: string;
  numero: string;
  ano: number;
  titulo: string;
  descricao?: string;
  urlOriginal?: string;
  fonteOrigem: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  dataDescoberta: string;
  dataAprovacao?: string;
  motivoRejeicao?: string;
 leiId?: string;
}

// Tipos para paginação
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class LawMonitoringService {
  private readonly baseUrl = '/law-monitoring';

  /**
   * Listar leis pendentes de aprovação
   */
  async listarPendentes(page = 0, size = 10): Promise<PageResponse<LawUpdateResponse>> {
    const response = await api.get(`${this.baseUrl}/pendentes`, {
      params: { page, size, sort: 'dataDescoberta,desc' }
    });
    return response.data;
  }

  /**
   * Listar todas as atualizações (histórico)
   */
  async listarTodas(page = 0, size = 10): Promise<PageResponse<LawUpdateResponse>> {
    const response = await api.get(`${this.baseUrl}/todas`, {
      params: { page, size, sort: 'dataDescoberta,desc' }
    });
    return response.data;
  }

  /**
   * Contar leis pendentes
   */
  async contarPendentes(): Promise<number> {
    const response = await api.get(`${this.baseUrl}/pendentes/contagem`);
    return response.data;
  }

  /**
   * Adicionar lei pendente manualmente
   */
  async adicionarLeiPendente(request: LawUpdateRequest): Promise<LawUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/adicionar`, request);
    return response.data;
  }

  /**
   * Aprovar lei pendente
   */
  async aprovarLei(id: string, aprovadoPor: string): Promise<LawUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/aprovar/${id}`, null, {
      params: { aprovadoPor }
    });
    return response.data;
  }

  /**
   * Rejeitar lei pendente
   */
  async rejeitarLei(id: string, motivoRejeicao: string): Promise<LawUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/rejeitar/${id}`, null, {
      params: { motivoRejeicao }
    });
    return response.data;
  }

  /**
   * Executar monitoramento manualmente
   */
  async executarMonitoramento(): Promise<void> {
    await api.post(`${this.baseUrl}/executar`);
  }
}

export const lawMonitoringService = new LawMonitoringService();
