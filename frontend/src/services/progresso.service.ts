import api from '@/lib/api';
import type { ProgressoCasoResponse } from '@/types/educacional';

export const progressoService = {
  async listar() {
    const response = await api.get<ProgressoCasoResponse[]>('/progresso');
    return response.data;
  },

  async obter(casoId: number) {
    const response = await api.get<ProgressoCasoResponse>(`/progresso/${casoId}`);
    return response.data;
  },
};
