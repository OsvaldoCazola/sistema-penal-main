import api from '@/lib/api';
import { Page, TipoCrime, Tribunal } from '@/types';

const tipoCrimeService = {
  listar() {
    return api.get<TipoCrime[]>('/tipos-crime').then(res => res.data);
  },

  buscarPorId(id: string) {
    return api.get<TipoCrime>(`/tipos-crime/${id}`).then(res => res.data);
  },
};

const tribunalService = {
  listar(page = 0, size = 100) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    return api.get<Page<Tribunal>>(`/tribunais?${queryParams.toString()}`).then(res => res.data);
  },

  buscarPorId(id: string) {
    return api.get<Tribunal>(`/tribunais/${id}`).then(res => res.data);
  },

  buscarPorProvincia(provincia: string) {
    return api.get<Page<Tribunal>>(`/tribunais?provincia=${provincia}`).then(res => res.data);
  },
};

export { tipoCrimeService, tribunalService };
