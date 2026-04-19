import api from '@/lib/api';

export interface Lei {
  id: string;
  numero: string;
  titulo: string;
  ano: number;
  tipo: string;
  ementa?: string;
  conteudo?: string;
  status: string;
  dataPublicacao?: string;
  dataVigencia?: string;
  fonteUrl?: string;
  artigos?: Artigo[];
}

export interface LeiRequest {
  tipo: string;
  numero: string;
  ano: number;
  titulo: string;
  ementa?: string;
  conteudo?: string;
  dataPublicacao?: string;
  dataVigencia?: string;
  fonteUrl?: string;
  artigos?: ArtigoRequest[];
}

export interface Artigo {
  id: string;
  numero: string;
  titulo?: string;
  conteudo: string;
  tipoPenal?: string;
  penaMinAnos?: number;
  penaMaxAnos?: number;
  ordem: number;
  versaoAtual?: number;
  leiId: string;
  leiTitulo: string;
  elementosJuridicos?: ElementoJuridico[];
  penalidades?: Penalidade[];
  categorias?: CategoriaCrime[];
}

export interface ArtigoRequest {
  numero: string;
  titulo?: string;
  conteudo: string;
  tipoPenal?: string;
  penaMinAnos?: number;
  penaMaxAnos?: number;
  ordem?: number;
  subdivisoes?: SubdivisaoRequest[];
  elementosJuridicos?: ElementoJuridicoRequest[];
  penalidades?: PenalidadeRequest[];
  categorias?: string[];
}

export interface SubdivisaoRequest {
  tipo: string;
  numero: string;
  conteudo: string;
  filhos?: SubdivisaoRequest[];
}

export interface ElementoJuridico {
  id: string;
  tipo: string;
  conteudo: string;
  ordem?: number;
  descricao?: string;
  artigoId: string;
}

export interface ElementoJuridicoRequest {
  tipo: string;
  conteudo: string;
  ordem?: number;
  descricao?: string;
}

export interface Penalidade {
  id: string;
  tipoPena: string;
  penaMinAnos?: number;
  penaMinMeses?: number;
  penaMinDias?: number;
  penaMaxAnos?: number;
  penaMaxMeses?: number;
  penaMaxDias?: number;
  multaMin?: number;
  multaMax?: number;
  descricao?: string;
  regime?: string;
  artigoId: string;
}

export interface PenalidadeRequest {
  tipoPena: string;
  penaMinAnos?: number;
  penaMinMeses?: number;
  penaMinDias?: number;
  penaMaxAnos?: number;
  penaMaxMeses?: number;
  penaMaxDias?: number;
  multaMin?: number;
  multaMax?: number;
  descricao?: string;
  regime?: string;
  flagrante?: boolean;
  detencao?: boolean;
  reclusao?: boolean;
}

export interface CategoriaCrime {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  quantidadeArtigos?: number;
}

export interface LeiIntegridade {
  id: string;
  leiId: string;
  hash: string;
  hashConteudo: string;
  dataVerificacao: string;
  statusVerificacao: string;
  versaoLei: number;
  observacoes?: string;
}

export interface ArtigoVersao {
  id: string;
  versao: number;
  conteudo: string;
  dataVigencia: string;
  motivoAlteracao?: string;
}

export interface ComparacaoArtigo {
  artigoId: string;
  numeroArtigo: string;
  leiIdentificacao: string;
  versaoAntiga: VersaoDetalhe;
  versaoNova: VersaoDetalhe;
  diferencas: DiferencaTexto[];
  resumoAlteracoes: string;
}

export interface VersaoDetalhe {
  versao: number;
  conteudo: string;
  dataVigencia: string;
  motivoAlteracao?: string;
}

export interface DiferencaTexto {
  tipo: 'ADICIONADO' | 'REMOVIDO' | 'MODIFICADO';
  textoAntigo: string;
  textoNovo: string;
  linhaInicio: number;
  linhaFim: number;
}

export const legislacaoService = {
  // Leis
  async listarLeis(params: {
    page?: number;
    size?: number;
    tipo?: string;
    ano?: number;
  }): Promise<any> {
    const urlParams = new URLSearchParams();
    if (params.page) urlParams.append('page', String(params.page));
    if (params.size) urlParams.append('size', String(params.size));
    if (params.tipo) urlParams.append('tipo', params.tipo);
    if (params.ano) urlParams.append('ano', String(params.ano));
    
    const response = await api.get(`/leis?${urlParams}`);
    return response.data;
  },

  async buscarLei(id: string): Promise<Lei> {
    const response = await api.get(`/leis/${id}`);
    return response.data;
  },

  async buscarLeiPorIdentificacao(tipo: string, numero: string, ano: number): Promise<Lei> {
    const response = await api.get(`/leis/identificacao?tipo=${tipo}&numero=${numero}&ano=${ano}`);
    return response.data;
  },

  async listarTipos(): Promise<string[]> {
    const response = await api.get('/leis/tipos');
    return response.data;
  },

  async listarAnos(): Promise<number[]> {
    const response = await api.get('/leis/anos');
    return response.data;
  },

  async criarLei(data: LeiRequest): Promise<Lei> {
    const response = await api.post('/leis', data);
    return response.data;
  },

  async atualizarLei(id: string, data: LeiRequest): Promise<Lei> {
    const response = await api.put(`/leis/${id}`, data);
    return response.data;
  },

  async excluirLei(id: string): Promise<void> {
    await api.delete(`/leis/${id}`);
  },

  async alterarStatusLei(id: string, status: string): Promise<void> {
    await api.patch(`/leis/${id}/status?status=${status}`);
  },

  // Artigos
  async listarArtigos(leiId: string): Promise<Artigo[]> {
    const response = await api.get(`/leis/${leiId}/artigos`);
    return response.data;
  },

  async buscarArtigo(id: string): Promise<Artigo> {
    const response = await api.get(`/artigos/${id}`);
    return response.data;
  },

  async criarArtigo(leiId: string, data: ArtigoRequest): Promise<Artigo> {
    const response = await api.post(`/leis/${leiId}/artigos`, data);
    return response.data;
  },

  async atualizarArtigo(id: string, data: ArtigoRequest): Promise<Artigo> {
    const response = await api.put(`/artigos/${id}`, data);
    return response.data;
  },

  async excluirArtigo(id: string): Promise<void> {
    await api.delete(`/artigos/${id}`);
  },

  // Elementos Jurídicos
  async listarElementosJuridicos(artigoId: string): Promise<ElementoJuridico[]> {
    const response = await api.get(`/leis/artigos/${artigoId}/elementos`);
    return response.data;
  },

  async criarElementoJuridico(artigoId: string, data: ElementoJuridicoRequest): Promise<ElementoJuridico> {
    const response = await api.post(`/leis/artigos/${artigoId}/elementos`, data);
    return response.data;
  },

  async excluirElementoJuridico(elementoId: string): Promise<void> {
    await api.delete(`/leis/elementos/${elementoId}`);
  },

  // Penalidades
  async listarPenalidades(artigoId: string): Promise<Penalidade[]> {
    const response = await api.get(`/leis/artigos/${artigoId}/penalidades`);
    return response.data;
  },

  async criarPenalidade(artigoId: string, data: PenalidadeRequest): Promise<Penalidade> {
    const response = await api.post(`/leis/artigos/${artigoId}/penalidades`, data);
    return response.data;
  },

  async excluirPenalidade(penalidadeId: string): Promise<void> {
    await api.delete(`/leis/penalidades/${penalidadeId}`);
  },

  // Categorias
  async listarCategorias(): Promise<CategoriaCrime[]> {
    const response = await api.get('/leis/categorias');
    return response.data;
  },

  async criarCategoria(data: { nome: string; descricao?: string; codigo?: string }): Promise<CategoriaCrime> {
    const response = await api.post('/leis/categorias', data);
    return response.data;
  },

  async adicionarArtigoCategoria(artigoId: string, categoriaId: string): Promise<CategoriaCrime> {
    const response = await api.post(`/leis/artigos/${artigoId}/categorias/${categoriaId}`);
    return response.data;
  },

  // Integridade
  async buscarIntegridade(leiId: string): Promise<LeiIntegridade> {
    const response = await api.get(`/leis/${leiId}/integridade`);
    return response.data;
  },

  async buscarHistoricoIntegridade(leiId: string): Promise<LeiIntegridade[]> {
    const response = await api.get(`/leis/${leiId}/integridade/historico`);
    return response.data;
  },

  async verificarIntegridade(leiId: string): Promise<LeiIntegridade> {
    const response = await api.post(`/leis/${leiId}/integridade/verificar`);
    return response.data;
  },

  // Versões
  async listarVersoes(artigoId: string): Promise<ArtigoVersao[]> {
    const response = await api.get(`/artigos/${artigoId}/versoes`);
    return response.data;
  },

  async compararVersoes(artigoId: string, versaoAntiga: number, versaoNova: number): Promise<ComparacaoArtigo> {
    const response = await api.get(`/artigos/${artigoId}/versoes/comparar`, {
      params: { versaoAntiga, versaoNova }
    });
    return response.data;
  },

  async compararComAtual(artigoId: string, versaoAntiga: number): Promise<ComparacaoArtigo> {
    const response = await api.get(`/artigos/${artigoId}/versoes/${versaoAntiga}/comparar-atual`);
    return response.data;
  },

  // Busca
  async buscarLeis(termo: string, page = 0, size = 20): Promise<any> {
    const response = await api.get(`/leis/busca?q=${termo}&page=${page}&size=${size}`);
    return response.data;
  },

  async buscarArtigos(termo: string, page = 0, size = 20): Promise<any> {
    const response = await api.get(`/leis/artigos/busca?q=${termo}&page=${page}&size=${size}`);
    return response.data;
  },

  // Importação de Leis da Internet
  async buscarLeisOnline(termo?: string): Promise<any[]> {
    const url = termo ? `/leis/importar/buscar?termo=${encodeURIComponent(termo)}` : '/leis/importar/buscar';
    const response = await api.get(url);
    return response.data;
  },

  async importarLei(data: LeiRequest): Promise<Lei> {
    const response = await api.post('/leis/importar', data);
    return response.data;
  },
};
