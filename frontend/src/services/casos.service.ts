import api from '@/lib/api';
import type {
  CasoResumoResponse,
  CasoDetalheResponse,
  RespostaPerguntaResponse,
} from '@/types/educacional';

export const casosService = {
  async listar(params?: { nivel?: number; categoria?: string }) {
    const response = await api.get<CasoResumoResponse[]>('/casos', { params });
    return response.data;
  },

  async obter(casoId: number) {
    const response = await api.get<CasoDetalheResponse>(`/casos/${casoId}`);
    return response.data;
  },

  async responderPergunta(casoId: number, perguntaId: string, resposta: string) {
    const response = await api.post<RespostaPerguntaResponse>(
      `/casos/${casoId}/perguntas/${perguntaId}/responder`,
      { resposta }
    );
    return response.data;
  },
};
