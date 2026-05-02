'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, PlayCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitleX, CardDescriptionXX } from @/components/ui/Card
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const MOCK_CASOS = [
  {
    id: '1',
    titulo: 'Furto Simples em Loja',
    descricao: 'João, 25 anos, entrou numa loja de roupas, escolheu algumas peças, escondeu-as debaixo da camisa e saiu sem pagar. O alarme não tocou e ele foi detido 2 quarteirões depois com as roupas ainda escondidas.',
    nivel: 1,
    categoria: 'Crimes contra o Património',
    artigos: 'Art. 155 CP',
    concluido: true,
    gabarito: 'CRIME: Furto Simples (Art. 155 CP)\n\nFUNDAMENTO: Subtração de coisa móvel alheia com intenção de apropriação ilícita. Não houve arrombamento, uso de força ou arma. Pena: 1 a 4 anos.'
  },
  {
    id: '2',
    titulo: 'Ofensas Corporais Simples',
    descricao: 'Durante uma briga de bar, Carlos desferiu um soco no rosto de Pedro, causando lesão que exigiu 10 dias de recuperação médica. Carlos não tem antecedentes e entregou-se no dia seguinte.',
    nivel: 1,
    categoria: 'Crimes contra as Pessoas',
    artigos: 'Art. 137 CP',
    concluido: true,
    gabarito: 'CRIME: Ofensas Corporais Simples (Art. 137 CP)\n\nFUNDAMENTO: Lesão com recuperação inferior a 30 dias configura ofensa corporal simples. Ato voluntário de ofender corpo alheio. Pena: 1 mês a 2 anos.'
  },
  {
    id: '3',
    titulo: 'Furto Qualificado vs Roubo',
    descricao: 'Marcos invadiu uma residência à noite, mediante arrombamento da janela, e subtraiu joias no valor de R$ 5.000. Não houve contato com moradores. Classifique o crime.',
    nivel: 2,
    categoria: 'Crimes contra o Património',
    artigos: 'Art. 155, §4º, I - CP',
    concluido: false,
    gabarito: 'CRIME: Furto Qualificado (Art. 155, §4º, I)\n\nFUNDAMENTO: A qualificadora de invasão de domicílio agrava o furto simples. Não é roubo pois não houve violência ou ameaça contra pessoa.'
  },
  {
    id: '4',
    titulo: 'Homicídio Culposo',
    descricao: 'Durante caça, José disparou achando que era um animal, mas acertou um colega que estava à frente. Não havia intenção de matar, mas houve negligência na segurança.',
    nivel: 2,
    categoria: 'Crimes contra as Pessoas',
    artigos: 'Art. 121, § 3º, II - CP',
    concluido: false,
    gabarito: 'CRIME: Homicídio Culposo (Art. 121, § 3º, II)\n\nFUNDAMENTO: Morte sem intenção de matar, mas com negligência. Pena: 1 a 3 anos. Se houver imprudência, a pena aumenta.'
  },
  {
    id: '5',
    titulo: 'Tráfico de Estupefacientes',
    descricao: 'Foram encontrados 50g de cocaína na mochila de Pedro. Ele alega que era para consumo próprio. O traficante seria aquele que tem a droga para venda, não para uso.',
    nivel: 3,
    categoria: 'Crimes contra a Saúde Pública',
    artigos: 'Art. 33, Lei 11.343/06',
    concluido: false,
    gabarito: 'CRIME: Tráfico de Drogas (Art. 33)\n\nFUNDAMENTO: A lei não estabelece quantidade mínima para tráfico. A destinação (venda vs uso) define o crime. Pena: 5 a 15 anos de reclusão.'
  },
  {
    id: '6',
    titulo: 'Burla - Art. 221 CP',
    descricao: 'André vendeu um carro que não possuía, recebendo o valor integral de R$ 30.000 do comprador. Ele alega que ia comprar para repassar, mas desapareceu com o dinheiro.',
    nivel: 2,
    categoria: 'Crimes contra o Património',
    artigos: 'Art. 221 CP',
    concluido: false,
    gabarito: 'CRIME: Burla (Art. 221 CP)\n\nFUNDAMENTO: Obter vantagem econômica mediante fraude. Dolo de não cumprir promessa. Pena: 1 a 5 anos e multa.'
  }
];

export default function CasosPraticosPage() {
  const [casos, setCasos] = useState(MOCK_CASOS);
  const [filtroNivel, setFiltroNivel] = useState<string>('');
  const [busca, setBusca] = useState('');
  const [casoAtual, setCasoAtual] = useState<any>(null);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [mostrouGabarito, setMostrouGabarito] = useState(false);

  const casosFiltrados = casos.filter(c => {
    const matchNivel = !filtroNivel || c.nivel === parseInt(filtroNivel);
    const matchBusca = !busca || c.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                       c.categoria.toLowerCase().includes(busca.toLowerCase());
    return matchNivel && matchBusca;
  });

  const badgeNivel = (n: number) => {
    switch(n) {
      case 1: return { bg: '#ECFDF5', text: '#059669', label: 'Básico 🌱' };
      case 2: return { bg: '#FEF3C7', text: '#D97706', label: 'Intermédio ⚡' };
      case 3: return { bg: '#FEF2F2', text: '#DC2626', label: 'Avançado 🔥' };
      default: return { bg: '#E5E7EB', text: '#6B7280', label: '-' };
    }
  };

  const iniciarCaso = (caso: any) => {
    setCasoAtual(caso);
    setEtapaAtual(0);
    setRespostas({});
    setFeedback({});
    setMostrouGabarito(false);
  };

  const responderPergunta = (perguntaId: string, resposta: string) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: resposta }));
    // Simula feedback (no real viria do backend)
    setFeedback(prev => ({ ...prev, [perguntaId]: resposta === 'correta' }));
  };

  const proximaEtapa = () => {
    if (etapaAtual < 4) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      setMostrouGabarito(true);
    }
  };

  const voltarCasos = () => {
    setCasoAtual(null);
  };

  if (casoAtual && !mostrouGabarito) {
    // Interface de estudo do caso
    const etapas = [
      { titulo: '📋 Descrição do Caso', desc: casoAtual.descricao },
      { 
        titulo: '❓ Enquadramento Jurídico',
        pergunta: 'Qual o crime praticado?',
        opcoes: [
          { id: 'A', text: 'Art. 155 - Furto Simples', key: 'correta' },
          { id: 'B', text: 'Art. 156 - Furto Qualificado', key: 'errada' },
          { id: 'C', text: 'Art. 157 - Roubo', key: 'errada' },
          { id: 'D', text: 'Art. 159 - Extorsão', key: 'errada' }
        ],
        tipo: 'MULTIPLA'
      },
      {
        titulo: '⚖️ Circunstâncias',
        desc: 'Marque os fatores presentes no caso:',
        opcoes: [
          { id: 'A', text: 'Réu primário (sem antecedentes)' },
          { id: 'B', text: 'Uso de arma ou violência' },
          { id: 'C', text: 'Arrependimento demonstrado' },
          { id: 'D', text: 'Valor elevado do bem' }
        ],
        tipo: 'CIRCUNSTANCIAS'
      },
      {
        titulo: '🧮 Cálculo da Pena',
        desc: 'Arraste para definir a pena sugerida (1 a 4 anos):',
        slider: true
      },
      {
        titulo: '📄 Resultado Final',
        desc: 'Revise o gabarito completo:',
        final: true
      }
    ];

    const etapa = etapas[etapaAtual];

    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header do Caso */}
          <div className="mb-6">
            <Button onClick={voltarCasos} variant="ghost" className="mb-4">
              ← Voltar para lista
            </Button>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge style={{ 
                  bg: badgeNivel(casoAtual.nivel).bg,
                  color: badgeNivel(casoAtual.nivel).text
                }}>
                  {badgeNivel(casoAtual.nivel).label}
                </Badge>
                <span className="text-sm text-gray-500">{casoAtual.categoria}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{casoAtual.titulo}</h1>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((etapaAtual + 1) / etapas.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Etapa {etapaAtual + 1} de {etapas.length}</p>
            </div>
          </div>

          {/* Conteúdo da Etapa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{etapa.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {etapaAtual === 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">
                    {etapa.desc}
                  </p>
                </div>
              )}

              {etapaAtual === 1 && (
                <RadioGroup value={respostas['1'] || ''} onValueChange={(v) => responderPergunta('1', v)}>
                  {etapa.opcoes.map((op: any) => (
                    <div key={op.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={op.key} id={`p1-${op.id}`} />
                      <Label htmlFor={`p1-${op.id}`} className="text-sm cursor-pointer">
                        {op.id}) {op.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {etapaAtual === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{etapa.desc}</p>
                  {etapa.opcoes.map((op: any) => (
                    <div key={op.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={`circ-${op.id}`}
                        className="w-4 h-4 rounded"
                        onChange={(e) => {
                          const key = `circ-${op.id}`;
                          setRespostas(prev => ({ ...prev, [key]: e.target.checked ? 'sim' : 'nao' }));
                        }}
                      />
                      <Label htmlFor={`circ-${op.id}`} className="text-sm cursor-pointer">{op.text}</Label>
                    </div>
                  ))}
                </div>
              )}

              {etapaAtual === 3 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">{etapa.desc}</p>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    step="0.5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => setRespostas(prev => ({ ...prev, pena: e.target.value }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1 ano</span>
                    <span className="font-medium text-blue-600">
                      {respostas.pena || '2.5'} anos
                    </span>
                    <span>4 anos</span>
                  </div>
                </div>
              )}

              {etapaAtual === 4 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">📝 Gabarito Completo</h4>
                  <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                    {casoAtual.gabarito}
                  </p>
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-xs text-yellow-600">
                      <strong>Artigos Relacionados:</strong> {casoAtual.artigos}
                    </p>
                  </div>
                </div>
              )}

              {/* Botão de navegação */}
              <div className="flex justify-between pt-4 border-t">
                {etapaAtual > 0 && (
                  <Button variant="outline" onClick={() => setEtapaAtual(etapaAtual - 1)}>
                    ← Anterior
                  </Button>
                )}
                {etapaAtual < etapas.length - 1 ? (
                  <Button onClick={proximaEtapa} className="ml-auto">
                    Próximo →
                  </Button>
                ) : (
                  <Button onClick={() => setMostrouGabarito(true)} className="ml-auto bg-green-600 hover:bg-green-700">
                    Finalizar Caso ✓
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (casoAtual && mostrouGabarito) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Button onClick={voltarCasos} variant="ghost" className="mb-4">
            ← Voltar para lista
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">📊 Caso Concluído!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">{casoAtual.titulo}</h3>
                <p className="text-sm text-green-700">{casoAtual.gabarito}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">Nível</p>
                  <p className="font-bold text-blue-900">{badgeNivel(casoAtual.nivel).label}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">Artigos</p>
                  <p className="font-bold text-purple-900">{casoAtual.artigos}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setMostrouGabarito(false)} variant="outline">
                  Revisar Análise
                </Button>
                <Button onClick={() => {
                  setCasoAtual(null);
                  window.scrollTo(0, 0);
                }}>
                  Próximo Caso
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 Casos Práticos de Direito Penal</h1>
        <p className="text-gray-600">Exercite seu raciocínio jurídico com casos baseados na legislação angolana</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Buscar casos..." 
                className="pl-10" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <Select value={filtroNivel} onValueChange={setFiltroNivel}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os níveis</SelectItem>
              <SelectItem value="1">Básico 🌱</SelectItem>
              <SelectItem value="2">Intermédio ⚡</SelectItem>
              <SelectItem value="3">Avançado 🔥</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de Casos */}
      <div className="grid gap-4">
        {casosFiltrados.map((caso) => {
          const badge = badgeNivel(caso.nivel);
          return (
            <Card key={caso.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => iniciarCaso(caso)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: badge.bg, color: badge.text }}>
                        {badge.label}
                      </Badge>
                      <span className="text-xs text-gray-500">{caso.categoria}</span>
                      {caso.concluido && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{caso.titulo}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{caso.descricao}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Artigos: <span className="font-medium">{caso.artigos}</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <PlayCircleIcon className="w-5 h-5 text-blue-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {casosFiltrados.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Nenhum caso encontrado com estes filtros</p>
          </Card>
        )}
      </div>
    </div>
  );
}
