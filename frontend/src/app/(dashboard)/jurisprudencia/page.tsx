'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ScaleIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BellIcon,
  BookOpenIcon,
  ArrowRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { sentencaService, type Sentenca } from '@/services/sentenca.service';
import { noticiaService, type Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const TIPOS_DECISAO = [
  { value: '',                     label: 'Todos os tipos' },
  { value: 'CONDENACAO',           label: 'Condenação' },
  { value: 'ABSOLVICAO',           label: 'Absolvição' },
  { value: 'EXTINCAO_PUNIBILIDADE',label: 'Extinção de Punibilidade' },
  { value: 'DESCLASSIFICACAO',     label: 'Desclassificação' },
];

const DECISAO_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  CONDENACAO:            { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  ABSOLVICAO:            { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  EXTINCAO_PUNIBILIDADE: { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
  DESCLASSIFICACAO:      { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
};

function DecisaoBadge({ tipo }: { tipo: string }) {
  const s = DECISAO_STYLE[tipo] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  const label = TIPOS_DECISAO.find(t => t.value === tipo)?.label ?? tipo;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string; value: number | string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}

type TabType = 'jurisprudencia' | 'atualizacoes';

export default function JurisprudenciaPage() {
  const [activeTab,  setActiveTab]  = useState<TabType>('jurisprudencia');
  const [sentencas,  setSentencas]  = useState<Sentenca[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [buscando,   setBuscando]   = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [selectedSentenca, setSelectedSentenca] = useState<Sentenca | null>(null);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>([]);
  const [loadingAtu,   setLoadingAtu]   = useState(false);

  useEffect(() => { carregarSentencas(); carregarEstatisticas(); }, [page, tipoFiltro]);
  useEffect(() => { if (activeTab === 'atualizacoes') carregarAtualizacoes(); }, [activeTab]);

  const carregarSentencas = async () => {
    setLoading(true);
    try {
      const params = tipoFiltro ? { tipoDecisao: tipoFiltro } : undefined;
      const r = await sentencaService.listar(params, page, 10);
      setSentencas(r.content || []);
      setTotalPages(r.totalPages || 0);
    } catch { toast.error('Erro ao carregar jurisprudência'); }
    finally { setLoading(false); }
  };

  const carregarEstatisticas = async () => {
    try { setEstatisticas(await sentencaService.estatisticas()); } catch {}
  };

  const carregarAtualizacoes = async () => {
    setLoadingAtu(true);
    try {
      const r = await noticiaService.listarAtualizacoes(0, 10);
      setAtualizacoes(r.content || []);
    } catch {}
    finally { setLoadingAtu(false); }
  };

  const handleBusca = async () => {
    if (!termoBusca.trim()) { carregarSentencas(); return; }
    setBuscando(true);
    try {
      const r = await sentencaService.buscarJurisprudencia(termoBusca, 0, 10);
      setSentencas(r.content || []);
      setTotalPages(r.totalPages || 0);
    } catch { toast.error('Erro na busca'); }
    finally { setBuscando(false); }
  };

  const tabs = [
    { id: 'jurisprudencia' as TabType, label: 'Jurisprudência', icon: ScaleIcon },
    { id: 'atualizacoes'  as TabType, label: 'Actualizações',  icon: BellIcon  },
  ];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Jurisprudência"
        subtitle="Base de dados de decisões judiciais — acórdãos e sentenças"
        icon={ScaleIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Jurisprudência' },
        ]}
      />

      {/* Indicadores */}
      {estatisticas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total de Acórdãos"    value={estatisticas.total      ?? 0} icon={DocumentTextIcon} color="#1D4ED8" />
          <StatCard title="Condenações"           value={estatisticas.condenacoes ?? 0} icon={XCircleIcon}      color="#DC2626" />
          <StatCard title="Absolvições"           value={estatisticas.absolicoes  ?? 0} icon={CheckCircleIcon}  color="#059669" />
          <StatCard title="Média de pena (meses)" value={Math.round(estatisticas.mediaPena ?? 0)} icon={ScaleIcon} color="#7C3AED" />
        </div>
      )}

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

      {/* ── Aba Jurisprudência ── */}
      {activeTab === 'jurisprudencia' && (
        <>
          {/* Barra de pesquisa */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar por palavras-chave, ementa, juiz..."
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBusca()}
                className="input-field pl-9"
              />
            </div>
            <div className="relative flex-shrink-0">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={tipoFiltro}
                onChange={e => { setTipoFiltro(e.target.value); setPage(0); }}
                className="input-field pl-9 w-auto appearance-none pr-8"
              >
                {TIPOS_DECISAO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <button
              onClick={handleBusca}
              disabled={buscando}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] disabled:opacity-60 transition-colors"
            >
              {buscando ? <Spinner size="sm" /> : <MagnifyingGlassIcon className="h-4 w-4" />}
              Pesquisar
            </button>
            {(termoBusca || tipoFiltro) && (
              <button
                onClick={() => { setTermoBusca(''); setTipoFiltro(''); setPage(0); carregarSentencas(); }}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <ArrowPathIcon className="h-3.5 w-3.5" /> Limpar
              </button>
            )}
          </div>

          {/* Grid lista + detalhe */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lista */}
            <div className="lg:col-span-2 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Spinner size="lg" />
                  <p className="text-sm text-gray-400">A carregar jurisprudência...</p>
                </div>
              ) : sentencas.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
                  <ScaleIcon className="h-12 w-12 text-gray-200 mb-3" />
                  <p className="text-sm font-semibold text-gray-600 mb-1">Nenhuma jurisprudência encontrada</p>
                  <p className="text-xs text-gray-400">
                    {termoBusca ? 'Tente outros termos.' : 'Adicione sentenças para construir a base.'}
                  </p>
                </div>
              ) : (
                sentencas.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSentenca(s)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md group ${
                      selectedSentenca?.id === s.id ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {s.dataSentenca ? formatDate(s.dataSentenca) : '—'}
                      </div>
                      <DecisaoBadge tipo={s.tipoDecisao} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1.5">
                      {s.tipoCrimeNome || 'Tipo de crime não especificado'}
                    </p>
                    {(s.ementa || (s as any).narrativa) && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {(s as any).narrativa || s.ementa}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      {s.juizNome && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" /> {s.juizNome}
                        </span>
                      )}
                      {s.penaMeses && (
                        <span className="ml-auto font-medium text-blue-600">{s.penaMeses} meses</span>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="text-xs font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="text-xs font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    Seguinte →
                  </button>
                </div>
              )}
            </div>

            {/* Painel de detalhe */}
            <div className="lg:col-span-1">
              {selectedSentenca ? (
                <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-800">Detalhes da Decisão</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="field-label">Tipo de decisão</p>
                      <DecisaoBadge tipo={selectedSentenca.tipoDecisao} />
                    </div>

                    {selectedSentenca.penaMeses && (
                      <div>
                        <p className="field-label">Pena</p>
                        <p className="text-base font-bold text-gray-900">{selectedSentenca.penaMeses} meses</p>
                        <p className="text-xs text-gray-500">{selectedSentenca.tipoPena ?? 'Prisão'}{selectedSentenca.regime ? ` · Regime ${selectedSentenca.regime}` : ''}</p>
                      </div>
                    )}

                    {selectedSentenca.juizNome && (
                      <div>
                        <p className="field-label">Juiz</p>
                        <p className="text-sm text-gray-800">{selectedSentenca.juizNome}</p>
                      </div>
                    )}

                    {selectedSentenca.ementa && (
                      <div>
                        <p className="field-label">Ementa</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{selectedSentenca.ementa}</p>
                      </div>
                    )}

                    {selectedSentenca.fundamentacao && (
                      <div>
                        <p className="field-label">Fundamentação</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{selectedSentenca.fundamentacao}</p>
                      </div>
                    )}

                    {selectedSentenca.transitadoJulgado && (
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700">Transitado em julgado</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedSentenca(null)}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 pt-2 border-t border-gray-100 transition-colors"
                  >
                    Fechar detalhe
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-12 text-center">
                  <ScaleIcon className="h-10 w-10 text-gray-200 mb-3" />
                  <p className="text-xs text-gray-400">Seleccione uma decisão para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Aba Actualizações ── */}
      {activeTab === 'atualizacoes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Actualizações legislativas"
              value={atualizacoes.filter(a => a.tipo === 'NOVA_LEI' || a.tipo === 'ATUALIZACAO_LEGISLATIVA').length}
              icon={BookOpenIcon} color="#1D4ED8"
            />
            <StatCard
              title="Nova jurisprudência"
              value={atualizacoes.filter(a => a.tipo === 'NOVA_JURISPRUDENCIA').length}
              icon={ScaleIcon} color="#7C3AED"
            />
          </div>

          {loadingAtu ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : atualizacoes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
              <BellIcon className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-600">Nenhuma actualização disponível</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {atualizacoes.map(a => <AtualizacaoCard key={a.id} atualizacao={a} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
