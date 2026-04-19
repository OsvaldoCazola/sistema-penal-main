import api from '@/lib/api';
import { Page } from '@/types';
import { Sentenca } from './sentenca.service';
import { Lei } from './legislacao.service';

// Tipos para atualizações do sistema - estendidos para incluir campos opcionais
export type TipoAtualizacao = 
  | 'NOVA_LEI'
  | 'ALTERACAO_ARTIGO'
  | 'NOVA_JURISPRUDENCIA'
  | 'ATUALIZACAO_LEGISLATIVA';

// Interface estendida para Lei com campos opcionais de data
export interface LeiAtualizacao {
  id: string;
  numero: string;
  titulo: string;
  ano: number;
  tipo: string;
  ementa?: string;
  status: string;
  dataPublicacao?: string;
  dataVigencia?: string;
}

// Interface estendida para Sentenca com campos opcionais de data
export interface SentencaAtualizacao {
  id: string;
  processoNumero: string;
  tipoDecisao: string;
  tipoCrimeNome?: string;
  penaMeses?: number;
  tipoPena?: string;
  regime?: string;
  dataSentenca?: string;
  ementa?: string;
  fundamentacao?: string;
  dispositivo?: string;
  juizNome?: string;
  transitadoJulgado?: boolean;
  createdAt?: string;
}

export interface Atualizacao {
  id: string;
  tipo: TipoAtualizacao;
  titulo: string;
  descricao: string;
  dataPublicacao: string;
  tipoLabel: string;
  tipoIcon: string;
  link: string;
  // Dados relacionados
  leiId?: string;
  artigoId?: string;
  sentencaId?: string;
}

export interface NoticiaSummary {
  id: string;
  titulo: string;
  subtitulo?: string;
  resumo?: string;
  imagemUrl?: string;
  categoria?: string;
  dataPublicacao: string;
  autor?: string;
}

export interface Noticia extends NoticiaSummary {
  conteudo: string;
  tags?: string[];
  visualizacoes: number;
}

// Mapeamento de tipos para labels e ícones
const TIPO_CONFIG: Record<TipoAtualizacao, { label: string; icon: string }> = {
  NOVA_LEI: { label: 'Nova Lei', icon: '📜' },
  ALTERACAO_ARTIGO: { label: 'Alteração de Artigo', icon: '📝' },
  NOVA_JURISPRUDENCIA: { label: 'Nova Jurisprudência', icon: '⚖️' },
  ATUALIZACAO_LEGISLATIVA: { label: 'AtualizaçãoLegislativa', icon: '🔄' },
};

// Converter lei para formato de atualização
const converterLeiParaAtualizacao = (lei: LeiAtualizacao): Atualizacao => ({
  id: `lei-${lei.id}`,
  tipo: 'NOVA_LEI',
  titulo: `${lei.tipo} nº ${lei.numero}/${lei.ano}`,
  descricao: lei.ementa || lei.titulo,
  dataPublicacao: lei.dataPublicacao || lei.dataVigencia || new Date().toISOString(),
  tipoLabel: TIPO_CONFIG.NOVA_LEI.label,
  tipoIcon: TIPO_CONFIG.NOVA_LEI.icon,
  link: `/legislacao/${lei.id}`,
  leiId: lei.id,
});

// Converter sentença para formato de atualização
const converterSentencaParaAtualizacao = (sentenca: SentencaAtualizacao): Atualizacao => ({
  id: `sentenca-${sentenca.id}`,
  tipo: 'NOVA_JURISPRUDENCIA',
  titulo: sentenca.tipoCrimeNome || 'Decisão Judicial',
  descricao: sentenca.ementa || `Tipo de decisão: ${sentenca.tipoDecisao}`,
  dataPublicacao: sentenca.dataSentenca || sentenca.createdAt || new Date().toISOString(),
  tipoLabel: TIPO_CONFIG.NOVA_JURISPRUDENCIA.label,
  tipoIcon: TIPO_CONFIG.NOVA_JURISPRUDENCIA.icon,
  link: `/jurisprudencia?search=${sentenca.id}`,
  sentencaId: sentenca.id,
});

const noticiaService = {
  /**
   * Buscar atualizações do sistema (leis + jurisprudência)
   * Este é o método principal para o módulo de notícias
   */
  async listarAtualizacoes(page = 0, size = 10): Promise<Page<Atualizacao>> {
    try {
      // Buscar leis e sentenças mais recentes
      const [leisResponse, sentencasResponse] = await Promise.all([
        api.get<Page<LeiAtualizacao>>(`/leis?page=0&size=${size * 2}&sort=dataVigencia,desc`),
        api.get<Page<SentencaAtualizacao>>(`/sentencas?page=0&size=${size * 2}&sort=createdAt,desc`),
      ]);

      const leis = leisResponse.data?.content || [];
      const sentencas = sentencasResponse.data?.content || [];

      // Converter para formato de atualização
      const atualizacoes: Atualizacao[] = [
        ...leis.map(converterLeiParaAtualizacao),
        ...sentencas.map(converterSentencaParaAtualizacao),
      ];

      // Ordenar por data (mais recentes primeiro)
      atualizacoes.sort((a, b) => 
        new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime()
      );

      // Paginar resultados
      const start = page * size;
      const pagedContent = atualizacoes.slice(start, start + size);

      return {
        content: pagedContent,
        totalElements: atualizacoes.length,
        totalPages: Math.ceil(atualizacoes.length / size),
        size,
        number: page,
        first: page === 0,
        last: start + size >= atualizacoes.length,
      };
    } catch (error) {
      console.error('Erro ao buscar atualizações:', error);
      // Retornar estrutura vazia em caso de erro
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
      };
    }
  },

  /**
   * Buscar apenas novas leis publicadas
   */
  async listarNovasLeis(page = 0, size = 5): Promise<Page<Atualizacao>> {
    try {
      const response = await api.get<Page<LeiAtualizacao>>(`/leis?page=${page}&size=${size}&sort=dataVigencia,desc`);
      const atualizacoes = (response.data?.content || []).map(converterLeiParaAtualizacao);
      
      return {
        content: atualizacoes,
        totalElements: response.data?.totalElements || 0,
        totalPages: response.data?.totalPages || 0,
        size: response.data?.size || size,
        number: page,
        first: response.data?.first || page === 0,
        last: response.data?.last || false,
      };
    } catch (error) {
      console.error('Erro ao buscar novas leis:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
      };
    }
  },

  /**
   * Buscar novas jurisprudências
   */
  async listarNovasJurisprudencias(page = 0, size = 5): Promise<Page<Atualizacao>> {
    try {
      const response = await api.get<Page<SentencaAtualizacao>>(`/sentencas?page=${page}&size=${size}&sort=createdAt,desc`);
      const atualizacoes = (response.data?.content || []).map(converterSentencaParaAtualizacao);

      return {
        content: atualizacoes,
        totalElements: response.data?.totalElements || 0,
        totalPages: response.data?.totalPages || 0,
        size: response.data?.size || size,
        number: page,
        first: response.data?.first || page === 0,
        last: response.data?.last || false,
      };
    } catch (error) {
      console.error('Erro ao buscar jurisprudências:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
      };
    }
  },

  listarDestaques(page = 0, size = 3) {
    // Redirecionar para listarAtualizacoes para manter compatibilidade
    return this.listarAtualizacoes(page, size);
  },

  listar(page = 0, size = 10, categoria?: string) {
    // Redirecionar para listarAtualizacoes para manter compatibilidade
    return this.listarAtualizacoes(page, size);
  },

  buscarPorId(id: string) {
    return api.get<Noticia>(`/noticias/${id}`).then(res => res.data);
  },

  buscarPorSlug(slug: string) {
    return api.get<Noticia>(`/noticias/slug/${slug}`).then(res => res.data);
  },
};

export { noticiaService, TIPO_CONFIG };
