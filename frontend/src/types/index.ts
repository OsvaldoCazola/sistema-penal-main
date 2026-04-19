// Enums
export enum Role {
  ADMIN = 'ADMIN',
  JUIZ = 'JUIZ',
  PROCURADOR = 'PROCURADOR',
  ADVOGADO = 'ADVOGADO',
  ESTUDANTE = 'ESTUDANTE',
}

export enum StatusProcesso {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  AGUARDANDO_AUDIENCIA = 'AGUARDANDO_AUDIENCIA',
  EM_JULGAMENTO = 'EM_JULGAMENTO',
  SENTENCIADO = 'SENTENCIADO',
  EM_RECURSO = 'EM_RECURSO',
  TRANSITADO_JULGADO = 'TRANSITADO_JULGADO',
  ARQUIVADO = 'ARQUIVADO',
  SUSPENSO = 'SUSPENSO',
}

export enum StatusDenuncia {
  RECEBIDA = 'RECEBIDA',
  EM_ANALISE = 'EM_ANALISE',
  ENCAMINHADA = 'ENCAMINHADA',
  EM_INVESTIGACAO = 'EM_INVESTIGACAO',
  ARQUIVADA = 'ARQUIVADA',
  CONCLUIDA = 'CONCLUIDA',
}

export enum StatusLei {
  VIGENTE = 'VIGENTE',
  REVOGADA = 'REVOGADA',
  PARCIALMENTE_REVOGADA = 'PARCIALMENTE_REVOGADA',
  SUSPENSA = 'SUSPENSA',
}

// Interfaces
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: Role;
  ativo: boolean;
  ultimoLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuario: Usuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  role: Role;  // Agora é obrigatório
}

export interface TipoCrime {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  penaMinimaMeses?: number;
  penaMaximaMeses?: number;
  artigoReferencia?: string;
  descricao?: string;
}

export interface Tribunal {
  id: string;
  nome: string;
  tipo: string;
  provincia: string;
  endereco?: string;
  juizPresidente?: string;
}

export interface Parte {
  tipo: string;
  nome: string;
  documento?: string;
  tipoDocumento?: string;
  endereco?: string;
  telefone?: string;
  advogadoNome?: string;
  advogadoOab?: string;
}

export interface Movimentacao {
  id: string;
  tipoEvento: string;
  descricao: string;
  dataEvento: string;
  responsavel: string;
  createdAt: string;
}

export interface Processo {
  id: string;
  numero: string;
  tribunal?: Tribunal;
  tipoCrime?: TipoCrime;
  status: StatusProcesso;
  fase?: string;
  dataAbertura: string;
  dataFato?: string;
  dataEncerramento?: string;
  descricaoFatos?: string;
  localFato?: string;
  provincia?: string;
  partes: Parte[];
  movimentacoes: Movimentacao[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessoSummary {
  id: string;
  numero: string;
  tribunalNome?: string;
  tipoCrimeNome?: string;
  status: StatusProcesso;
  dataAbertura: string;
  provincia?: string;
}

export interface Ocorrencia {
  id: string;
  tipoCrime?: TipoCrime;
  dataOcorrencia: string;
  provincia: string;
  municipio?: string;
  latitude?: number;
  longitude?: number;
  descricao?: string;
  dados?: Record<string, unknown>;
}

export interface Denuncia {
  id: string;
  protocolo: string;
  tipoCrime?: TipoCrime;
  descricao: string;
  dataFato?: string;
  localFato?: string;
  provincia?: string;
  anonima: boolean;
  status: StatusDenuncia;
  classificacaoIa?: Record<string, unknown>;
  createdAt: string;
}

export interface Lei {
  id: string;
  tipo: string;
  numero: string;
  ano: number;
  titulo: string;
  ementa?: string;
  conteudo?: string;
  dataPublicacao?: string;
  dataVigencia?: string;
  status: StatusLei;
  fonteUrl?: string;
  artigos?: Artigo[];
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
  leiTitulo?: string;
  elementosJuridicos?: ElementoJuridico[];
  penalidades?: Penalidade[];
  categorias?: CategoriaCrime[];
}

export interface ElementoJuridico {
  id: string;
  tipo: string;
  conteudo: string;
  ordem?: number;
  descricao?: string;
  artigoId: string;
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

export interface DashboardResponse {
  resumoGeral: {
    totalProcessos: number;
    processosEmAndamento: number;
    totalSentencas: number;
    totalDenuncias: number;
    denunciasHoje: number;
    usuariosAtivos: number;
  };
  processosPorStatus: Record<string, number>;
  processosPorTribunal: Record<string, number>;
  denunciasPorStatus: Record<string, number>;
  denunciasPorProvincia: Record<string, number>;
  sentencasEstatisticas: Record<string, unknown>;
  tendencias: {
    processosUltimos30Dias: Record<string, number>;
    denunciasUltimos30Dias: Record<string, number>;
  };
  estatisticasModulos?: {
    totalLeis: number;
    totalArtigos: number;
    totalSimulacoes: number;
    totalVerificacoes: number;
    totalUsuarios: number;
    crimesMaisSimulados: Record<string, number>;
    artigosMaisUsados: Record<string, number>;
    artigosMaisVerificados: Record<string, number>;
    alertasPenas: number;
  };
}

export interface MapaResponse {
  ocorrencias: Ocorrencia[];
  provincias: ProvinciaStats[];
  totalOcorrencias: number;
}

export interface ProvinciaStats {
  provincia: string;
  total: number;
  percentual: number;
  latitude: number;
  longitude: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
}

export interface TimelineResponse {
  processoId: string;
  numeroProcesso: string;
  statusAtual: string;
  etapas: EtapaTimeline[];
  etapaAtualIndex: number;
  percentualConcluido: number;
}

export interface EtapaTimeline {
  ordem: number;
  codigo: string;
  nome: string;
  descricao: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  dataInicio: string | null;
  dataConclusao: string | null;
  duracaoDias: number | null;
  eventos: EventoTimeline[];
}

export interface EventoTimeline {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  responsavel: string | null;
}
