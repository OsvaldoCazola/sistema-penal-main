'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ScaleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { processoService } from '@/services/processo.service';
import { formatDate, formatStatus } from '@/lib/utils';
import type { ProcessoSummary, StatusProcesso, Page } from '@/types';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os estados' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'AGUARDANDO_AUDIENCIA', label: 'Aguardando Audiência' },
  { value: 'EM_JULGAMENTO', label: 'Em Julgamento' },
  { value: 'SENTENCIADO', label: 'Sentenciado' },
  { value: 'EM_RECURSO', label: 'Em Recurso' },
  { value: 'TRANSITADO_JULGADO', label: 'Transitado em Julgado' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
  { value: 'SUSPENSO', label: 'Suspenso' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  EM_ANDAMENTO:          { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  AGUARDANDO_AUDIENCIA:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  EM_JULGAMENTO:         { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  SENTENCIADO:           { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  EM_RECURSO:            { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  TRANSITADO_JULGADO:    { bg: 'bg-gray-100',   text: 'text-gray-600',    dot: 'bg-gray-500' },
  ARQUIVADO:             { bg: 'bg-gray-100',   text: 'text-gray-500',    dot: 'bg-gray-400' },
  SUSPENSO:              { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
};

const PALETTE: Record<string, { bar: string; icon: string; iconText: string }> = {
  blue:   { bar: '#1D4ED8', icon: '#EFF6FF', iconText: '#1D4ED8' },
  amber:  { bar: '#D97706', icon: '#FFFBEB', iconText: '#D97706' },
  purple: { bar: '#7C3AED', icon: '#F5F3FF', iconText: '#7C3AED' },
  green:  { bar: '#059669', icon: '#ECFDF5', iconText: '#059669' },
};

export default function ProcessosPage() {
  const router = useRouter();
  const [data, setData] = useState<Page<ProcessoSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await processoService.listar({
        page,
        size: 20,
        status: (statusFilter as StatusProcesso) || undefined,
      });
      setData(response);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const c = data?.content ?? [];
    return {
      total: data?.totalElements ?? 0,
      emAndamento: c.filter(p => p.status === 'EM_ANDAMENTO' || p.status === 'AGUARDANDO_AUDIENCIA').length,
      emJulgamento: c.filter(p => p.status === 'EM_JULGAMENTO').length,
      sentenciados: c.filter(p => p.status === 'SENTENCIADO').length,
    };
  }, [data]);

  const statCards = [
    { title: 'Total de Processos', value: stats.total,       icon: DocumentTextIcon, color: 'blue' },
    { title: 'Em Andamento',       value: stats.emAndamento, icon: ClockIcon,         color: 'amber' },
    { title: 'Em Julgamento',      value: stats.emJulgamento,icon: ScaleIcon,         color: 'purple' },
    { title: 'Sentenciados',       value: stats.sentenciados,icon: CheckCircleIcon,   color: 'green' },
  ];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Gestão de Processos"
        subtitle="Acompanhamento e gestão de processos judiciais"
        icon={ScaleIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Processos' },
        ]}
        actions={
          <Link href="/processos/novo">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] transition-colors">
              <PlusIcon className="h-4 w-4" />
              Novo Processo
            </button>
          </Link>
        }
      />

      {/* Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const p = PALETTE[s.color];
          return (
            <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-5 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: p.bar }} />
              <div className="flex items-center gap-3 mt-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: p.icon }}>
                  <s.icon className="h-4 w-4" style={{ color: p.iconText }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar número, réu, crime..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>
        <div className="relative flex-shrink-0">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
            className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {data && (
          <p className="text-xs text-gray-400 ml-auto flex-shrink-0">
            {data.totalElements} processo{data.totalElements !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">A carregar processos...</p>
        </div>
      ) : data && data.content.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_140px_120px_160px_36px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {['Processo', 'Tipo de Crime', 'Data Abertura', 'Estado', ''].map(h => (
              <p key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</p>
            ))}
          </div>

          {/* Linhas */}
          {data.content
            .filter(p => !search || p.numero?.toLowerCase().includes(search.toLowerCase()) || p.tipoCrimeNome?.toLowerCase().includes(search.toLowerCase()))
            .map((proc) => {
              const st = STATUS_STYLES[proc.status] ?? STATUS_STYLES.ARQUIVADO;
              return (
                <div
                  key={proc.id}
                  onClick={() => router.push(`/processos/${proc.id}`)}
                  className="grid grid-cols-[1fr_140px_120px_160px_36px] gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                      {proc.numero}
                    </p>
                    {proc.provincia && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{proc.provincia}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{proc.tipoCrimeNome ?? '—'}</p>
                  <p className="text-xs text-gray-500">{proc.dataAbertura ? formatDate(proc.dataAbertura) : '—'}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md w-fit ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {formatStatus(proc.status)}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              );
            })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
            <ScaleIcon className="h-7 w-7 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Nenhum processo encontrado</h3>
          <p className="text-xs text-gray-400 mb-5">
            {statusFilter ? 'Tente outro filtro de estado.' : 'Ainda não existem processos registados.'}
          </p>
          <Link href="/processos/novo">
            <button className="text-xs font-semibold text-white bg-[#1a2744] px-4 py-2 rounded-lg hover:bg-[#243561] transition-colors">
              Registar primeiro processo
            </button>
          </Link>
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
            Página {page + 1} de {data.totalPages} · {data.totalElements} registos
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="text-xs font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Seguinte →
          </button>
        </div>
      )}
    </div>
  );
}
