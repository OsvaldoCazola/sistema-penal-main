export interface CasoResumoResponse {
  id: number;
  titulo: string;
  nivel: number;
  categoria: string;
  totalPerguntas: number;
  percentualConclusao: number;
  status: string;
}

export interface PerguntaCasoResponse {
  id: string;
  ordem: number;
  titulo: string;
  enunciado: string;
  pontuacaoMaxima: number;
  respostaAnterior?: string;
  correta?: boolean | null;
  pontosObtidos?: number | null;
}

export interface CasoDetalheResponse {
  id: number;
  titulo: string;
  descricaoFacto: string;
  nivel: number;
  categoria: string;
  artigosRelacionados: string;
  gabaritoDisponivel: boolean;
  gabaritoExplicacao: string | null;
  perguntas: PerguntaCasoResponse[];
}

export interface RespostaPerguntaResponse {
  perguntaId: string;
  respostaRegistrada: string;
  correta: boolean;
  pontosObtidos: number;
  pontuacaoMaxima: number;
  feedbackProfessor: string;
  respostaEsperada: string;
}

export interface ProgressoCasoResponse {
  casoId: number;
  titulo: string;
  totalPerguntas: number;
  perguntasRespondidas: number;
  perguntasCorretas: number;
  pontuacaoObtida: number;
  pontuacaoMaxima: number;
  percentualConclusao: number;
  status: string;
  atualizadoEm: string;
}
