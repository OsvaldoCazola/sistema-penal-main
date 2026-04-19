import api from '@/lib/api';
import type { DashboardResponse } from '@/types';

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
  totalCrimes: number;
  totalSimulacoes: number;
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

  async getCrimeEstatisticas(): Promise<CrimeEstatisticas> {
    const response = await api.get<CrimeEstatisticas>('/dashboard/estatisticas-crimes');
    return response.data;
  },
};
