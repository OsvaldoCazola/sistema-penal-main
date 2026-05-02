'use client';

import { useState, useEffect } from 'react';
import { 
  ScaleIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui';
import { dashboardService } from '@/services/dashboard.service';
import { noticiaService, Atualizacao } from '@/services/noticia.service';

/* ── Dados dos Casos Práticos ──────────────────────────────────────── */
interface CasoPratico {
  id: string;
  titulo: string;
  descricao: string;
  crimesEnvolvidos: string[];
  pontuacao: number;
  tempoEstimado: number; // em minutos
  situacao: 'disponivel' | 'em_andamento' | 'concluido';
  dificuldade: 'basico' | 'intermediario' | 'avancado';
}

const CASOS_PRATICOS: CasoPratico[] = [
  {
    id: '1',
    titulo: 'Roubo Qualificado com Arma',
    descricao: 'João, armado com revólver, abordou Maria em via pública, exigindo seus pertences. Após a entrega, fugiu do local. Considere que João tem antecedentes criminais por crimes contra o patrimônio.',
    crimesEnvolvidos: ['Roubo Qualificado (Art. 157, §2º, I - CP)', 'Porte Ilegal de Arma'],
    pontuacao: 10,
    tempoEstimado: 15,
    situacao: 'disponivel',
    dificuldade: 'intermediario'
  },
  {
    id: '2',
    titulo: 'Homicídio por Legítima Defesa',
    descricao: 'Durante uma tentativa de assalto, Carlos foi atacado por dois indivíduos. Para se defender, Carlos utilizou uma faca, resultando na morte de um dos agressores. Havia proporcionalidade na defesa?',
    crimesEnvolvidos: ['Homicídio (Art. 121, CP)', 'Legítima Defesa (Art. 25, CP)'],
    pontuacao: 15,
    tempoEstimado: 20,
    situacao: 'disponivel',
    dificuldade: 'avancado'
  },
  {
    id: '3',
    titulo: 'Tráfico de Estupefacientes',
    descricao: 'Foram encontrados 50g de cocaína em poder de Pedro, que alega desconhecer a substância. A posse era para consumo próprio ou tráfico? Analise as circunstâncias.',
    crimesEnvolvidos: ['Tráfico de Drogas (Art. 33, Lei 11.343/06)', 'Posse para Consumo'],
    pontuacao: 12,
    tempoEstimado: 18,
    situacao: 'disponivel',
    dificuldade: 'intermediario'
  },
  {
    id: '4',
    titulo: 'Furto Qualificado',
    descricao: 'Ana invadiu uma residência à noite, mediante arrombamento da porta dos fundos, e subtraiu joias no valor de R$ 5.000,00. Considere a qualificadora de invasão de domicílio.',
    crimesEnvolvidos: ['Furto Qualificado (Art. 155, §4º, I - CP)'],
    pontuacao: 8,
    tempoEstimado: 12,
    situacao: 'disponivel',
    dificuldade: 'basico'
  },
  {
    id: '5',
    titulo: 'Lesão Corporal Seguida de Morte',
    descricao: 'Após discussão, Marcos desferiu um soco no rosto de Lucas, que veio a óbito devido a uma anomalia cardíaca não detectada previamente. Existe nexo causal?',
    crimesEnvolvidos: ['Lesão Corporal (Art. 129, CP)', 'Nexo Causal'],
    pontuacao: 14,
    tempoEstimado: 25,
    situacao: 'disponivel',
    dificuldade: 'avancado'
  }
];

interface Pergunta {
  id: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

const PERGUNTAS: Record<string, Pergunta[]> = {
  '1': [
    {
      id: '1.1',
      pergunta: 'Qual a pena mínima para roubo qualificado com arma de fogo?',
      opcoes: ['2 a 4 anos', '4 a 10 anos', '6 a 12 anos', '8 a 15 anos'],
      correta: 1,
      explicacao: 'O Art. 157, §2º, I do CP prevê pena de 4 a 10 anos para roubo com arma de fogo.'
    },
    {
      id: '1.2',
      pergunta: 'Qual o fundamento legal para majoração da pena?',
      opcoes: ['Uso de força', 'Uso de arma', 'Resultado morte', 'Crime hediondo'],
      correta: 1,
      explicacao: 'A majoração refere-se ao uso de arma de fogo, conforme §2º, I do Art. 157.'
    }
  ],
  '2': [
    {
      id: '2.1',
      pergunta: 'A legítima defesa exige proporcionalidade?',
      opcoes: ['Sim, sempre', 'Não, nunca', 'Apenas para defesa de terceiros', 'Apenas para defesa de bens'],
      correta: 0,
      explicacao: 'O Art. 25 do CP exige que a defesa seja moderada e proporcional ao perigo.'
    },
    {
      id: '2.2',
      pergunta: 'O que ocorre se a defesa for desproporcional?',
      opcoes: ['Excludente mantida', 'Homicídio privilegiado', 'Homicídio doloso comum', 'Lesão corporal'],
      correta: 2,
      explicacao: 'A desproporcionalidade afasta a legítima defesa, configurando homicídio doloso.'
    }
  ],
  '3': [
    {
      id: '3.1',
      pergunta: 'Qual a quantidade mínima para tráfico de cocaína?',
      opcoes: ['10g', '30g', '50g', 'Não há quantidade mínima'],
      correta: 3,
      explicacao: 'A Lei 11.343/06 não estabelece quantidade mínima para tráfico, bastando a natureza da substância.'
    },
    {
      id: '3.2',
      pergunta: 'A alegação de desconhecimento afasta o dolo?',
      opcoes: ['Sim, sempre', 'Quando comprovado', 'Apenas para uso próprio', 'Nunca'],
      correta: 1,
      explicacao: 'O dolo pode ser afastado se comprovada a ausência de conhecimento da natureza ilícita.'
    }
  ],
  '4': [
    {
      id: '4.1',
      pergunta: 'A invasão de domicílio é qualificadora?',
      opcoes: ['Sim, para furto', 'Não, apenas para roubo', 'Sim, para qualquer crime', 'Apenas à noite'],
      correta: 0,
      explicacao: 'O §4º, I do Art. 155 do CP considera a invasão de domicílio como qualificadora do furto.'
    },
    {
      id: '4.2',
      pergunta: 'O furto qualificado é crime hediondo?',
      opcoes: ['Sim', 'Não', 'Apenas com arma', 'Apenas com violência'],
      correta: 1,
      explicacao: 'O furto qualificado não consta no rol de crimes hediondos da Lei 8.072/90.'
    }
  ],
  '5': [
    {
      id: '5.1',
      pergunta: 'O nexo causal é exigido para lesão seguida de morte?',
      opcoes: ['Sim, sempre', 'Não, nunca', 'Apenas para dolo', 'Apenas para culpa'],
      correta: 0,
      explicacao: 'O nexo causal é elemento essencial para a configuração do resultado (morte).'
    },
    {
      id: '5.2',
      pergunta: 'A anomalia cardíaca afasta o nexo causal?',
      opcoes: ['Sim, sempre', 'Quando for única causa', 'Apenas se conhecida', 'Nunca'],
      correta: 1,
      explicacao: 'Se a anomalia for a única causa, pode afastar o nexo causal (teoria da causalidade).'
    }
  ]
};

const dificuldadeBadge = (d: string) => {
  const config: any = {
    'basico': { bg: '#ECFDF5', text: '#059669', label: 'Básico' },
    'intermediario': { bg: '#FEF3C7', text: '#D97706', label: 'Intermediário' },
    'avancado': { bg: '#FEF2F2', text: '#DC2626', label: 'Avançado' }
  };
  const c = config[d] || config['basico'];
  return { bg: c.bg, text: c.text, label: c.label };
};

export default function CasosPraticosPage() {
  const [casos, setCasos] = useState<CasoPratico[]>(CASOS_PRATICOS);
  const [casoSelecionado, setCasoSelecionado] = useState<CasoPratico | null>(null);
  const [etapaAtual, setEtapaAtual] = useState<'descricao' | 'analise' | 'resposta'>('descricao');
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [analiseUsuario, setAnaliseUsuario] = useState('');
  const [pontosTotais, setPontosTotais] = useState(0);
  const [casosConcluidos, setCasosConcluidos] = useState(0);

  // Simula carregamento de progresso
  useEffect(() => {
    const saved = localStorage.getItem('casos-praticos-progresso');
    if (saved) {
      const prog = JSON.parse(saved);
      setCasos(prev => prev.map(c => ({
        ...c,
        situacao: prog[c.id] || 'disponivel'
      })));
      setPontosTotais(prog.pontos || 0);
      setCasosConcluidos(prog.concluidos || 0);
    }
  }, []);

  const salvarProgresso = (id: string, novaSituacao: any, pontosNovos: number) => {
    const prog: any = { pontos: pontosTotais + pontosNovos, concluidos: casosConcluidos + 1 };
    casos.forEach(c => prog[c.id] = c.situacao);
    prog[id] = novaSituacao;
    localStorage.setItem('casos-praticos-progresso', JSON.stringify(prog));
    setPontosTotais(prev => prev + pontosNovos);
    setCasosConcluidos(prev => prev + 1);
  };

  const iniciarCaso = (caso: CasoPratico) => {
    setCasoSelecionado(caso);
    setEtapaAtual('descricao');
    setRespostas({});
    setFeedback({});
    setAnaliseUsuario('');
  };

  const responderPergunta = (idPergunta: string, indice: number) => {
    setRespostas(prev => ({ ...prev, [idPergunta]: indice }));
    const perguntas = PERGUNTAS[casoSelecionado!.id];
    const pergunta = perguntas.find(p => p.id === idPergunta)!;
    setFeedback(prev => ({ ...prev, [idPergunta]: indice === pergunta.correta }));
  };

  const finalizarCaso = () => {
    const perguntas = PERGUNTAS[casoSelecionado!.id];
    const acertos = perguntas.filter(p => feedback[p.id]).length;
    const total = perguntas.length;
    salvarProgresso(casoSelecionado!.id, 'concluido', casoSelecionado!.pontuacao);
    
    setCasos(prev => prev.map(c => 
      c.id === casoSelecionado!.id ? { ...c, situacao: 'concluido' as const } : c
    ));
    
    alert(`Caso concluído!\nAcertos: ${acertos}/${total}\nPontos ganhos: ${casoSelecionado!.pontuacao}\n\nAnálise registrada:\n${analiseUsuario || 'Nenhuma análise fornecida'}`);
    setCasoSelecionado(null);
  };

  if (casoSelecionado) {
    const perguntas = PERGUNTAS[casoSelecionado.id] || [];
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <button
            onClick={() => setCasoSelecionado(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Voltar para casos
          </button>

          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{casoSelecionado.titulo}</h1>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-sm" style={{ 
                    background: dificuldadeBadge(casoSelecionado.dificuldade).bg,
                    color: dificuldadeBadge(casoSelecionado.dificuldade).text
                  }}>
                    {dificuldadeBadge(casoSelecionado.dificuldade).label}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                    {casoSelecionado.pontuacao} pts
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                    ⏱ {casoSelecionado.tempoEstimado} min
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">📋 Descrição do Caso</h3>
              <p className="text-gray-700 leading-relaxed">{casoSelecionado.descricao}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">⚖️ Crimes Envolvidos</h3>
              <div className="flex flex-wrap gap-2">
                {casoSelecionado.crimesEnvolvidos.map((crime, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                    {crime}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Etapas */}
          <div className="mb-6">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button
                onClick={() => setEtapaAtual('descricao')}
                className={`pb-2 px-4 font-medium ${etapaAtual === 'descricao' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Descrição
              </button>
              <button
                onClick={() => setEtapaAtual('analise')}
                className={`pb-2 px-4 font-medium ${etapaAtual === 'analise' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Análise
              </button>
              <button
                onClick={() => setEtapaAtual('resposta')}
                className={`pb-2 px-4 font-medium ${etapaAtual === 'resposta' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Teste ({perguntas.length} perguntas)
              </button>
            </div>

            {/* Painel da Etapa */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {etapaAtual === 'descricao' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">📝 Análise do Caso</h3>
                  <textarea
                    value={analiseUsuario}
                    onChange={(e) => setAnaliseUsuario(e.target.value)}
                    placeholder="Faça sua análise do caso. Considere:
- Tipificação penal aplicável
- Causas de aumento/diminuição de pena
- Causas excludentes de ilicitude
- NEXO causal
- Dolo ou culpa"
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {etapaAtual === 'analise' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">⚖️ Enquadramento Proposto</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Crime Principal</h4>
                      <p className="text-blue-800">{casoSelecionado.crimesEnvolvidos[0]}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">Qualificadoras</h4>
                      <ul className="list-disc list-inside text-gray-800 mt-2 space-y-1">
                        {casoSelecionado.crimesEnvolvidos.slice(1).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {etapaAtual === 'resposta' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">📝 Questionário de Avaliação</h3>
                  <div className="space-y-6">
                    {perguntas.map((pergunta, idx) => (
                      <div key={pergunta.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                            Q{idx + 1}
                          </span>
                          <h4 className="font-medium text-gray-900">{pergunta.pergunta}</h4>
                        </div>
                        <div className="space-y-2">
                          {pergunta.opcoes.map((opcao, i) => {
                            const respondido = respostas[pergunta.id] === i;
                            const correta = pergunta.correta === i;
                            const mostrouFeedback = feedback[pergunta.id] !== undefined;
                            
                            return (
                              <label key={i} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                                style={{
                                  backgroundColor: mostrouFeedback 
                                    ? (correta ? '#ECFDF5' : (respondido ? '#FEF2F2' : 'white'))
                                    : (respondido ? '#EFF6FF' : 'white'),
                                  borderColor: mostrouFeedback
                                    ? (correta ? '#059669' : (respondido ? '#DC2626' : '#D1D5DB'))
                                    : (respondido ? '#3B82F6' : '#D1D5DB'),
                                  borderWidth: 1
                                }}>
                                <input
                                  type="radio"
                                  name={pergunta.id}
                                  checked={respondido}
                                  onChange={() => responderPergunta(pergunta.id, i)}
                                  className="w-4 h-4 text-blue-600"
                                  disabled={feedback[pergunta.id] !== undefined}
                                />
                                <span className="text-sm">{opcao}</span>
                                {mostrouFeedback && (
                                  <span className="ml-auto">
                                    {correta ? (
                                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    ) : respondido ? (
                                      <XCircleIcon className="w-5 h-5 text-red-500" />
                                    ) : null}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                        {feedback[pergunta.id] !== undefined && (
                          <div className="mt-3 p-3 rounded-lg text-sm" style={{ 
                            backgroundColor: feedback[pergunta.id] ? '#ECFDF5' : '#FEF2F2',
                            color: feedback[pergunta.id] ? '#059669' : '#DC2626'
                          }}>
                            <strong className="font-medium">
                              {feedback[pergunta.id] ? '✅ Correto! ' : '❌ Incorreto. '}
                            </strong>
                            {pergunta.explicacao}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between mt-6 pt-4 border-t">
                {etapaAtual === 'analise' && (
                  <button
                    onClick={() => setEtapaAtual('descricao')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Anterior
                  </button>
                )}
                {etapaAtual === 'resposta' && (
                  <button
                    onClick={() => setEtapaAtual('analise')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Anterior
                  </button>
                )}
                
                <div className="ml-auto">
                  {etapaAtual === 'descricao' && (
                    <button
                      onClick={() => setEtapaAtual('analise')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Próximo →
                    </button>
                  )}
                  {etapaAtual === 'analise' && (
                    <button
                      onClick={() => setEtapaAtual('resposta')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Testar Conhecimento →
                    </button>
                  )}
                  {etapaAtual === 'resposta' && (
                    <button
                      onClick={finalizarCaso}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Finalizar Caso ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Módulo de Estudo</h1>
          <p className="text-gray-600">Casos práticos e exercícios para desenvolvimento de raciocínio jurídico</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{casos.length}</p>
                <p className="text-sm text-gray-500">Casos disponíveis</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{casosConcluidos}</p>
                <p className="text-sm text-gray-500">Concluídos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ScaleIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pontosTotais}</p>
                <p className="text-sm text-gray-500">Pontos totais</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Casos */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Casos Práticos Disponíveis</h2>
          </div>
          <div className="divide-y">
            {casos.map((caso) => {
              const badge = dificuldadeBadge(caso.dificuldade);
              const isConcluido = caso.situacao === 'concluido';
              
              return (
                <div key={caso.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{caso.titulo}</h3>
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: badge.bg, color: badge.text }}>
                          {badge.label}
                        </span>
                        {isConcluido && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            ✓ Concluído
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">{caso.descricao}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {caso.crimesEnvolvidos.map((crime, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs">
                            {crime}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ScaleIcon className="w-4 h-4" />
                          {caso.pontuacao} pontos
                        </span>
                        <span className="flex items-center gap-1">
                          <DocumentTextIcon className="w-4 h-4" />
                          {caso.tempoEstimado} min
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => iniciarCaso(caso)}
                      disabled={isConcluido}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
                        isConcluido
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isConcluido ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Concluído
                        </>
                      ) : (
                        <>
                          Iniciar
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
