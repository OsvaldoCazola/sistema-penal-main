import api from '@/lib/api';
import { Page } from '@/types';

export interface Sentenca {
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
  narrativa?: string;
  juizNome?: string;
  transitadoJulgado?: boolean;
  createdAt?: string;
}

export interface SentencaEstatisticas {
  total?: number;
  condenacoes?: number;
  absolicoes?: number;
  mediaPena?: number;
}

const sentencaService = {
  listar(params?: { tipoDecisao?: string; tipoCrimeId?: string }, page = 0, size = 10) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    if (params?.tipoDecisao) {
      queryParams.append('tipoDecisao', params.tipoDecisao);
    }
    if (params?.tipoCrimeId) {
      queryParams.append('tipoCrimeId', params.tipoCrimeId);
    }
    
    return api.get<Page<Sentenca>>(`/sentencas?${queryParams.toString()}`).then(res => res.data);
  },

  buscarJurisprudencia(termoBusca: string, page = 0, size = 10) {
    const queryParams = new URLSearchParams();
    queryParams.append('q', termoBusca);
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    return api.get<Page<Sentenca>>(`/sentencas/jurisprudencia?${queryParams.toString()}`).then(res => res.data);
  },

  buscarPorId(id: string) {
    return api.get<Sentenca>(`/sentencas/${id}`).then(res => res.data);
  },

  buscarPorProcesso(processoId: string) {
    return api.get<Sentenca>(`/sentencas/processo/${processoId}`).then(res => res.data);
  },

  estatisticas() {
    return api.get<SentencaEstatisticas>('/sentencas/estatisticas').then(res => res.data);
  },

  criar(data: Partial<Sentenca>) {
    return api.post<Sentenca>('/sentencas', data).then(res => res.data);
  },

  atualizar(id: string, data: Partial<Sentenca>) {
    return api.put<Sentenca>(`/sentencas/${id}`, data).then(res => res.data);
  },

  transitarJulgado(id: string) {
    return api.patch<{ message: string }>(`/sentencas/${id}/transito-julgado`).then(res => res.data);
  },
};

export { sentencaService };
