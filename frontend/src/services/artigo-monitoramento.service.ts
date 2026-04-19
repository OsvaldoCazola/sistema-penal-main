import api from '@/lib/api';

// Tipos para ArticleUpdate

export interface ArtigoUpdateRequest {
  titulo: string;
  conteudo: string;
  numeroArtigo?: number;
  nomeSecao?: string;
  ordemSecao?: number;
  leiId?: string;
  leiIdentificacao?: string;
  urlOriginal?: string;
  fonteOrigem?: string;
}

export interface ArtigoUpdateResponse {
  id: string;
  titulo: string;
  conteudo: string;
  numeroArtigo?: number;
  nomeSecao?: string;
  ordemSecao?: number;
  leiId?: string;
  leiIdentificacao?: string;
  fonteUrl?: string;
  fonteOrigem: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  dataDescoberta: string;
  dataAprovacao?: string;
  motivoRejeicao?: string;
  artigoId?: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class ArticleMonitoringService {
  private readonly baseUrl = '/article-monitoring';

  /**
   * Listar artigos pendentes de aprovação
   */
  async listarPendentes(page = 0, size = 10): Promise<PageResponse<ArtigoUpdateResponse>> {
    const response = await api.get(`${this.baseUrl}/pendentes`, {
      params: { page, size, sort: 'dataDescoberta,desc' }
    });
    return response.data;
  }

  /**
   * Listar todas as atualizações (histórico)
   */
  async listarTodas(page = 0, size = 10): Promise<PageResponse<ArtigoUpdateResponse>> {
    const response = await api.get(`${this.baseUrl}/todas`, {
      params: { page, size, sort: 'dataDescoberta,desc' }
    });
    return response.data;
  }

  /**
   * Contar artigos pendentes
   */
  async contarPendentes(): Promise<number> {
    const response = await api.get(`${this.baseUrl}/pendentes/contagem`);
    return response.data.pendentes;
  }

  /**
   * Adicionar artigo pendente manualmente
   */
  async adicionarArtigoPendente(request: ArtigoUpdateRequest): Promise<ArtigoUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/adicionar`, request);
    return response.data;
  }

  /**
   * Aprovar artigo pendente
   */
  async aprovarArtigo(id: string, aprovadoPor: string): Promise<ArtigoUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/aprovar/${id}`, null, {
      params: { aprovadoPor }
    });
    return response.data;
  }

  /**
   * Rejeitar artigo pendente
   */
  async rejeitarArtigo(id: string, motivoRejeicao: string): Promise<ArtigoUpdateResponse> {
    const response = await api.post(`${this.baseUrl}/rejeitar/${id}`, { motivo: motivoRejeicao });
    return response.data;
  }

  /**
   * Executar monitoramento manualmente
   */
  async executarMonitoramento(): Promise<void> {
    await api.post(`${this.baseUrl}/executar`);
  }
}

export const articleMonitoringService = new ArticleMonitoringService();
