import api from '@/lib/api';

export interface CasoParaSimulador {
  id: string;
  descricao: string;
  tema: string;
}

export interface SimuladorRequest {
  simulacaoId: string;
  casoId: string | null;
  tipoCrime: string;
  origem: 'CHAT' | 'ALEATORIO';
}

export interface QuizResponse {
  sucesso: boolean;
  acertou: boolean;
  respostaCorreta: string;
  alternativas: string[];
  pontuacaoObtida: number;
  feedback: string;
  resultadoId: string;
}

export interface ResultadoSimulacao {
  sucesso: boolean;
  simulacaoId: string;
  totalQuestoes: number;
  totalAcertos: number;
  pontuacaoMedia: number;
  porTipoCrime: Record<string, number>;
  acertosPorTipoCrime: Record<string, number>;
  detalhes: Array<{
    id: string;
    respostaDada: string;
    acertou: boolean;
    tipoCrime: string;
    origem: string;
  }>;
}

export interface HistoricoSimulacao {
  simulacaoId: string;
  totalQuestoes: number;
  totalAcertos: number;
  pontuacao: number;
  tipoCrime: string;
  origem: string;
  ultimaTentativa: string;
}

export const quizSimuladorService = {
  async listarCasosDisponiveis(): Promise<CasoParaSimulador[]> {
    try {
      const response = await api.get<CasoParaSimulador[]>('/api/simulador/casos-disponiveis');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado: apenas estudantes podem acessar o simulador');
      }
      throw error;
    }
  },

  async iniciarSimulacao(casoId: string | null, tipoCrime: string, origem: 'CHAT' | 'ALEATORIO'): Promise<string> {
    try {
      const request = {
        casoId,
        tipoCrime,
        origem
      };
      const response = await api.post<{ simulacaoId: string }>('/api/simulador/iniciar', request);
      return response.data.simulacaoId;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado: apenas estudantes podem acessar o simulador');
      }
      throw error;
    }
  },

  async responderPergunta(simulacaoId: string, casoId: string | null, resposta: string): Promise<QuizResponse> {
    try {
      const request = {
        simulacaoId,
        casoId,
        resposta
      };
      const response = await api.post<QuizResponse>('/api/simulador/responder', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado: apenas estudantes podem acessar o simulador');
      }
      throw error;
    }
  },

  async obterResultado(simulacaoId: string): Promise<ResultadoSimulacao> {
    try {
      const response = await api.get<ResultadoSimulacao>(`/api/simulador/resultado/${simulacaoId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado: apenas estudantes podem acessar o simulador');
      }
      throw error;
    }
  },

  async obterHistorico(): Promise<HistoricoSimulacao[]> {
    try {
      const response = await api.get<HistoricoSimulacao[]>('/api/simulador/historico');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado: apenas estudantes podem acessar o simulador');
      }
      throw error;
    }
  }
};