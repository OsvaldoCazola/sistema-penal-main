'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ScaleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import {
  buscaService,
  CATEGORIAS_JURIDICAS,
  type AnaliseCasoResponse,
  type BuscaResultado,
  CategoriaJuridica,
} from '@/services/ia.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type TabType = 'busca' | 'analise';

const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

function RelevanciaBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = score >= 0.8 ? '#059669' : score >= 0.5 ? '#D97706' : '#6B7280';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-medium text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function BuscaJuridicaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('busca');
  const router = useRouter();
  const { user } = useAuthStore();

  // Busca
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaBusca, setCategoriaBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<BuscaResultado[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Análise
  const [descricaoCaso, setDescricaoCaso] = useState('');
  const [categoriaAnalise, setCategoriaAnalise] = useState('');
  const [tipoCrime, setTipoCrime] = useState('');
  const [resultadoAnalise, setResultadoAnalise] = useState<AnaliseCasoResponse | null>(null);
  const [isAnalisando, setIsAnalisando] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === Role.ADMIN) {
      toast.error('Administrador não pode aceder à busca jurídica.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleBusca = async () => {
    if (!termoBusca.trim()) return;
    setIsSearching(true);
    try {
      const r = await buscaService.buscaSemantica({
        termo: termoBusca,
        categoria: categoriaBusca || undefined,
        limite: 20,
      });
      setResultadosBusca(r.resultados);
      if (r.total === 0) toast('Nenhum resultado encontrado. Tente outros termos.', { icon: 'ℹ️' });
    } catch {
      toast.error('Erro ao realizar busca');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalise = async () => {
    if (!descricaoCaso.trim()) return;
    setIsAnalisando(true);
    try {
      const r = await buscaService.analisarCaso({
        descricao: descricaoCaso,
        categoria: categoriaAnalise || undefined,
        tipoCrime: tipoCrime || undefined,
        limite: 10,
      });
      setResultadoAnalise(r);
      toast.success('Análise concluída');
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao analisar caso');
    } finally {
      setIsAnalisando(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'busca',   label: 'Busca Semântica', icon: MagnifyingGlassIcon },
    { id: 'analise', label: 'Análise de Caso',  icon: SparklesIcon },
  ];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Análise de Casos com IA"
        subtitle="Busca semântica e análise jurídica inteligente com base na legislação angolana"
        icon={SparklesIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Análise de Casos IA' },
        ]}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-[#1a2744] text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Busca Semântica ── */}
      {activeTab === 'busca' && (
        <div className="space-y-4">
          {/* Formulário de busca */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-3">Pesquisa na Base Legislativa</p>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar termos jurídicos, crimes, artigos..."
                  value={termoBusca}
                  onChange={e => setTermoBusca(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBusca()}
                  className={inputCls + ' pl-9'}
                />
              </div>
               <select
                 value={categoriaBusca}
                 onChange={e => setCategoriaBusca(e.target.value)}
                 className={inputCls + ' w-auto'}
               >
                 <option value="">Todas as categorias</option>
                 {CATEGORIAS_JURIDICAS.map(c => (
                   <option key={c.value} value={c.value}>{c.label}</option>
                 ))}
               </select>
              <button
                onClick={handleBusca}
                disabled={!termoBusca.trim() || isSearching}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSearching ? <Spinner size="sm" /> : <MagnifyingGlassIcon className="h-4 w-4" />}
                Pesquisar
              </button>
            </div>
          </div>

          {/* Resultados da busca */}
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-gray-400">A pesquisar na base legislativa...</p>
            </div>
          ) : resultadosBusca.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {resultadosBusca.length} resultado{resultadosBusca.length !== 1 ? 's' : ''} encontrado{resultadosBusca.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => setResultadosBusca([])}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  <ArrowPathIcon className="h-3 w-3" /> Limpar
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {resultadosBusca.map((r) => (
                  <div key={r.id} className="px-5 py-4 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpenIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{r.titulo}</p>
                          <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex-shrink-0">
                            {r.categoria}
                          </span>
                        </div>
                        {r.resumo && <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{r.resumo}</p>}
                        {r.referenciaLegal && (
                          <p className="text-[10px] text-gray-400 mt-1.5">Ref: {r.referenciaLegal}</p>
                        )}
                        <div className="mt-2">
                          <RelevanciaBar score={r.score} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : termoBusca && !isSearching ? (
            <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
              <MagnifyingGlassIcon className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-600">Nenhum resultado para "{termoBusca}"</p>
              <p className="text-xs text-gray-400 mt-1">Tente termos diferentes ou remova os filtros</p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Análise de Caso ── */}
      {activeTab === 'analise' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Formulário */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">Descreva o Caso</p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Descrição dos factos *
              </label>
              <textarea
                rows={7}
                placeholder="Descreva os factos do caso de forma objectiva. A IA identificará os artigos aplicáveis e a jurisprudência relevante..."
                value={descricaoCaso}
                onChange={e => setDescricaoCaso(e.target.value)}
                className={inputCls + ' resize-none'}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Categoria jurídica
                </label>
                <select
                  value={categoriaAnalise}
                  onChange={e => setCategoriaAnalise(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Todas</option>
                  {CATEGORIAS_JURIDICAS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tipo de crime
                </label>
                <input
                  type="text"
                  placeholder="Ex: roubo, homicídio..."
                  value={tipoCrime}
                  onChange={e => setTipoCrime(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAnalise}
                disabled={!descricaoCaso.trim() || isAnalisando}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAnalisando
                  ? <><Spinner size="sm" /> A analisar...</>
                  : <><SparklesIcon className="h-4 w-4" /> Analisar Caso</>
                }
              </button>
              {resultadoAnalise && (
                <button
                  onClick={() => { setResultadoAnalise(null); setDescricaoCaso(''); }}
                  className="px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Resultado da análise */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            {!resultadoAnalise && !isAnalisando && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <SparklesIcon className="h-7 w-7 text-purple-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Resultado da análise</p>
                <p className="text-xs text-gray-400">Descreva o caso e clique em "Analisar Caso"</p>
              </div>
            )}

            {isAnalisando && (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <Spinner size="lg" />
                <p className="mt-4 text-sm text-gray-400">A analisar o caso com IA...</p>
              </div>
            )}

            {resultadoAnalise && !isAnalisando && (
              <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">Resultado da Análise</p>

                {/* Leis aplicáveis */}
                {resultadoAnalise.leisAplicaveis && resultadoAnalise.leisAplicaveis.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Leis Aplicáveis ({resultadoAnalise.leisAplicaveis.length})
                    </p>
                    <div className="space-y-3">
                      {resultadoAnalise.leisAplicaveis.map((lei, i) => (
                        <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-blue-900 leading-tight">{lei.titulo}</p>
                            <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex-shrink-0">
                              {lei.referenciaLegal}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">{lei.explicacao}</p>
                          <RelevanciaBar score={lei.relevancia} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Palavras detectadas */}
                {resultadoAnalise.palavrasDetectadas && resultadoAnalise.palavrasDetectadas.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Termos identificados</p>
                    <div className="flex flex-wrap gap-1.5">
                      {resultadoAnalise.palavrasDetectadas.map((p, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          {p.palavra}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sumário */}
                {resultadoAnalise.analise && (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Análise</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{resultadoAnalise.analise}</p>
                  </div>
                )}

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                  <LightBulbIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Esta análise é gerada por IA e tem carácter indicativo. Consulte sempre a legislação completa e um profissional qualificado.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
