import api from '@/lib/api';

export interface Fato {
  descricao: string;
  local?: string;
  data?: string;
  participantes?: string[];
  favoravel?: boolean;
}

export interface EnquadramentoRequest {
  descricaoCaso: string;
  tipoCrime: string;
  fatos?: Fato[];
  circunstancias?: string[];
  elementosVerificados?: Record<string, boolean>;
  flagrante?: boolean;
  observacoes?: string;
}

export interface ElementoMatched {
  elemento: string;
  descricao: string;
  fatoCorrespondente: string;
  verificado: boolean;
  artigoReferencia: string;
}

export interface ElementoFaltante {
  elemento: string;
  descricao: string;
  indispensavel: boolean;
}

export interface CrimePossivel {
  artigoId: string;
  artigoNumero: string;
  artigoTitulo: string;
  tipoCrime: string;
  probabilidade: number;
  penaMinima: string;
  penaMaxima: string;
  tipoPenal: string;
  concurso: boolean;
  tipoConcurso?: string;
  elementosEncontrados: ElementoMatched[];
  elementosFaltantes: ElementoFaltante[];
  justificativa: string;
}

export interface Conclusao {
  recomendacao: string;
  artigoMaisProximo?: string;
  nivelConfianca: 'ALTO' | 'MEDIO' | 'BAIXO' | 'MÉDIO';
  requerAnaliseJuridica?: boolean;
}

export interface PassoExplicativo {
  ordem: number;
  fase: string;
  titulo: string;
  descricao: string;
  detalhes: string;
  referencias?: string[];
  success: boolean;
}

export interface MapaElementos {
  elementosObrigatorios: Record<string, boolean>;
  elementosQualificadores: Record<string, boolean>;
  palavrasChaveIdentificadas: string[];
  mapeamentoFatos?: Record<string, string>;
}

export interface EnquadramentoResponse {
  id: string;
  descricaoCasoOriginal: string;
  crimesPossiveis: CrimePossivel[];
  conclusao: Conclusao;
  passosExplicativos: PassoExplicativo[];
  mapaElementos: MapaElementos;
  advertencias: string[];
  dataAnalise: string;
}

export const simuladorService = {
  async enquadrar(data: EnquadramentoRequest): Promise<EnquadramentoResponse> {
    try {
      const response = await api.post<EnquadramentoResponse>('/simulador/enquadrar', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Sem permissão: Apenas JUIZ, PROCURADOR, ADVOGADO e ESTUDANTE (modo estudo) podem usar o Simulador de Penas');
      }
      throw error;
    }
  },
};
