import api from '@/lib/api';

// Tipos para Busca Semântica
export interface BuscaSemanticaRequest {
  termo: string;
  categoria?: string;
  limite?: number;
  threshold?: number;
}

export interface BuscaResultado {
  id: string;
  titulo: string;
  resumo?: string;
  categoria: string;
  score: number;
  referenciaLegal?: string;
}

export interface ListaResultados {
  resultados: BuscaResultado[];
  total: number;
  termoBuscado: string;
  categoria?: string;
  threshold?: number;
}

export interface AnaliseCasoRequest {
  descricao: string;
  tipoCrime?: string;
  categoria?: string;
  limite?: number;
}

export interface LeiAplicavel {
  id: string;
  titulo: string;
  referenciaLegal: string;
  categoria: string;
  relevancia: number;
  explicacao: string;
  jurisprudencia?: string;
  palavrasRelacionadas?: string[];
}

/**
 * Palavra-chave detectada na descrição do caso
 */
export interface PalavraDetectada {
  palavra: string;
  tipo: string;
  relevancia: number;
}

/**
 * Mapeamento de palavra-chave para artigo
 * Exemplo: "roubo" → Artigo 157
 */
export interface PalavraArtigoMapping {
  palavra: string;
  tipo: string;
  artigoId: string;
  artigoTitulo: string;
  justificativa: string;
}

/**
 * Explicação da IA para uma palavra-chave
 */
export interface AiExplanation {
  id: string;
  termoBusca: string;
  artigoId?: string;
  artigoTitulo?: string;
  palavraChave?: string;
  tipoPalavra?: string;
  relevancia?: number;
  justificativa?: string;
  createdAt?: string;
  usuarioId?: string;
}

export interface AnaliseCasoResponse {
  descricaoAnalisada: string;
  tipoCrime: string;
  categoria: string;
  leisAplicaveis: LeiAplicavel[];
  analise: string;
  recomendacoes: string[];
  palavrasDetectadas?: PalavraDetectada[];
  mapeamentoPalavrasArtigos?: Record<string, PalavraArtigoMapping[]>;
}

export type CategoriaJuridica = 
  | 'CRIMES_PESSOA'
  | 'CRIMES_PATRIMONIO'
  | 'CRIMES_HONRA'
  | 'CRIMES_FAMILIA'
  | 'CRIMES_SEXUAIS'
  | 'CRIMES_SAUDE'
  | 'CRIMES_ECONOMICOS'
  | 'CRIMES_PUBLICOS'
  | 'CRIMES_COMUN'
  | 'CRIMES_ORGANIZADO'
  | 'CRIMES_MILITARES'
  | 'LEIS_PENAIS_ESPECIAIS';

export const CATEGORIAS_JURIDICAS: { value: CategoriaJuridica; label: string }[] = [
  { value: 'CRIMES_PESSOA', label: 'Crimes contra a Pessoa' },
  { value: 'CRIMES_PATRIMONIO', label: 'Crimes contra o Património' },
  { value: 'CRIMES_HONRA', label: 'Crimes contra a Honra' },
  { value: 'CRIMES_FAMILIA', label: 'Crimes contra a Família' },
  { value: 'CRIMES_SEXUAIS', label: 'Crimes Sexuais' },
  { value: 'CRIMES_SAUDE', label: 'Crimes contra a Saúde Pública' },
  { value: 'CRIMES_ECONOMICOS', label: 'Crimes Económicos e Financeiros' },
  { value: 'CRIMES_PUBLICOS', label: 'Crimes contra a Administração Pública' },
  { value: 'CRIMES_COMUN', label: 'Crimes de Perigo Comum' },
  { value: 'CRIMES_ORGANIZADO', label: 'Criminalidade Organizada' },
  { value: 'CRIMES_MILITARES', label: 'Crimes Militares' },
  { value: 'LEIS_PENAIS_ESPECIAIS', label: 'Leis Penais Especiais' },
];

// Tipos para Chat
export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  conteudo: string;
  fontes?: FonteReferencia[];
  createdAt: string;
}

export interface FonteReferencia {
  tipo: string;
  titulo: string;
  referencia?: string;
  relevancia?: number;
  conteudo?: string;
}

export interface ChatSession {
  id: string;
  titulo: string;
  status: 'ATIVA' | 'ARQUIVADA';
  totalMensagens: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  sessaoId?: string;
  mensagem: string;
}

export interface ChatResponse {
  sessaoId: string;
  resposta: string;
  fontes?: FonteReferencia[];
  tokensUsados?: number;
}

// Tipos para Previsão
export interface PrevisaoRequest {
  processoId?: string;
  tipoCrimeId: string;
  reuPrimario?: boolean;
  confissao?: boolean;
  agravantes?: string[];
  atenuantes?: string[];
  idadeReu?: number;
  tentativa?: boolean;
  numeroVitimas?: number;
  valorPrejuizo?: number;
  violencia?: boolean;
  armaFogo?: boolean;
}

export interface PrevisaoResponse {
  id: string;
  processoId?: string;
  tipoCrime: string;
  penaPrevistaMeses: number;
  penaFormatada: string;
  confianca: number;
  explicacao: Record<string, unknown>;
  inputFeatures: Record<string, unknown>;
  sentencaRealMeses?: number;
  createdAt: string;
}

// Services
class BuscaService {
  async buscaSemantica(request: BuscaSemanticaRequest): Promise<ListaResultados> {
    const response = await api.post<ListaResultados>('/busca/semantica', request);
    return response.data;
  }

  async analisarCaso(request: AnaliseCasoRequest): Promise<AnaliseCasoResponse> {
    try {
      const response = await api.post<AnaliseCasoResponse>('/busca/analisar-caso', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Sem permissão: Apenas JUIZ, PROCURADOR, ADVOGADO e ESTUDANTE (modo simulação) podem analisar casos');
      }
      throw error;
    }
  }

  async getCategorias(): Promise<CategoriaJuridica[]> {
    const response = await api.get<CategoriaJuridica[]>('/busca/categorias');
    return response.data;
  }

  async buscarRelacionadas(categoria: CategoriaJuridica, limite?: number): Promise<ListaResultados> {
    const params = new URLSearchParams();
    params.append('categoria', categoria);
    if (limite) params.append('limite', limite.toString());
    const response = await api.post<ListaResultados>(`/busca/relacionadas?${params.toString()}`, {});
    return response.data;
  }

  /**
   * Busca explicações salvas no banco de dados
   */
  async getExplicacoes(params: {
    termoBusca?: string;
    artigoId?: string;
    usuarioId?: string;
    tipoPalavra?: string;
  } = {}): Promise<AiExplanation[]> {
    const queryParams = new URLSearchParams();
    if (params.termoBusca) queryParams.append('termoBusca', params.termoBusca);
    if (params.artigoId) queryParams.append('artigoId', params.artigoId);
    if (params.usuarioId) queryParams.append('usuarioId', params.usuarioId);
    if (params.tipoPalavra) queryParams.append('tipoPalavra', params.tipoPalavra);
    
    const response = await api.get<AiExplanation[]>(`/busca/explicacoes?${queryParams.toString()}`);
    return response.data;
  }
}

class ChatService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat', request);
    return response.data;
  }

  async getSessoes(): Promise<ChatSession[]> {
    const response = await api.get<ChatSession[]>('/chat/sessoes');
    return response.data;
  }

  async getMensagens(sessaoId: string): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>(`/chat/sessoes/${sessaoId}/mensagens`);
    return response.data;
  }

  async arquivarSessao(sessaoId: string): Promise<void> {
    await api.patch(`/chat/sessoes/${sessaoId}/arquivar`);
  }

  async deleteSessao(sessaoId: string): Promise<void> {
    await api.delete(`/chat/sessoes/${sessaoId}`);
  }
}

class PrevisaoService {
  async preverSentenca(request: PrevisaoRequest): Promise<PrevisaoResponse> {
    const response = await api.post<PrevisaoResponse>('/previsao', request);
    return response.data;
  }

  async getHistorico(): Promise<PrevisaoResponse[]> {
    const response = await api.get<PrevisaoResponse[]>('/previsao/historico');
    return response.data;
  }
}

export const buscaService = new BuscaService();
export const chatService = new ChatService();
export const previsaoService = new PrevisaoService();
