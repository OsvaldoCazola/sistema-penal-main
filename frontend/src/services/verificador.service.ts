import api from '@/lib/api';

export interface VerificarPenaRequest {
  artigoId: string; // UUID do artigo
  tipoCrime: string;
  circunstanciasIds?: string[];
  flagrante?: boolean;
  reincidencia?: boolean;
  confissao?: boolean;
  reparacaoDano?: boolean;
  observacoes?: string;
}

export interface ArtigoInfo {
  id: string;
  numero: string;
  titulo: string;
  tipoPenal: string;
}

export interface PenaCalculada {
  anos: number;
  meses: number;
  dias: number;
  multa?: number;
  descricao: string;
}

export interface AjustePena {
  tipo: string;
  descricao: string;
  percentual?: number | null;
  baseLegal?: string;
  aplicado: boolean;
}

export interface PassoJustificativo {
  ordem: number;
  titulo: string;
  descricao: string;
  artigoReferencia?: string;
  favoravel: boolean;
}

export interface BaseLegal {
  artigoPrincipal: string;
  artigoAgregador?: string;
  artigosRelevantes: string[];
}

export interface VerificarPenaResponse {
  id: string;
  artigo: ArtigoInfo;
  penaBase: PenaCalculada;
  ajustes: AjustePena[];
  penaFinal: PenaCalculada;
  regimeRecomendado?: string;
  justificacao: PassoJustificativo[];
  baseLegal: BaseLegal;
  houveFlagrante: boolean;
  houveReincidencia: boolean;
  dataVerificacao: string;
}

export const verificadorService = {
  async calcularPena(data: VerificarPenaRequest): Promise<VerificarPenaResponse> {
    try {
      const response = await api.post<VerificarPenaResponse>('/verificador/calcular', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Sem permissão: Apenas JUIZ, PROCURADOR, ADVOGADO e ESTUDANTE (modo estudo) podem usar o Verificador de Penas');
      }
      throw error;
    }
  },

  /**
   * Busca artigos do repositório jurídico para seleção
   */
  async listarArtigos(): Promise<ArtigoInfo[]> {
    const response = await api.get<ArtigoInfo[]>('/api/repositorio/artigos');
    return response.data;
  },
};
