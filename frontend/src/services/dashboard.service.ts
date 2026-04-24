import api from '@/lib/api';
import type {
  DashboardResponse,
  SimulacaoRegistroSummary,
  VerificacaoRegistroSummary,
} from '@/types';

export interface CrimeEstatisticas {
  crimesPorRegiao: {
    regiao: string;
    quantidade: number;
    percentual: number;
  }[];
  crimesMaisSimulados: {
    tipoCrime: string;
    quantidade: number;
    percentual: number;
  }[];
  tiposCrimeProcessos: {
    tipoCrime: string;
    quantidade: number;
    percentual: number;
  }[];
  totalCrimes: number;
  totalSimulacoes: number;
  filtroTipoCrime?: string | null;
}

export interface AtividadesRecentesResponse {
  simulacoes: SimulacaoRegistroSummary[];
  totalSimulacoes: number;
  verificacoes: VerificacaoRegistroSummary[];
  totalVerificacoes: number;
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>('/dashboard');
    return response.data;
  },

  async getEstatisticasTipoCrime(): Promise<Record<string, unknown>> {
    const response = await api.get<Record<string, unknown>>('/dashboard/tipos-crime');
    return response.data;
  },

  async getCrimeEstatisticas(tipoCrime?: string): Promise<CrimeEstatisticas> {
    const response = await api.get<CrimeEstatisticas>('/dashboard/estatisticas-crimes', {
      params: tipoCrime ? { tipoCrime } : undefined,
    });
    return response.data;
  },

  async getAtividadesRecentes(page = 0, size = 6): Promise<AtividadesRecentesResponse> {
    const response = await api.get<AtividadesRecentesResponse>('/dashboard/atividades-recentes', {
      params: { page, size },
    });
    return response.data;
  },
};
