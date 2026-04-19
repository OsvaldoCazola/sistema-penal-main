'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ScaleIcon,
  BuildingLibraryIcon,
  DocumentCheckIcon,
  BookmarkIcon,
  PlusIcon,
  DocumentPlusIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner, Button } from '@/components/ui';
import api from '@/lib/api';
import { formatDate, formatStatus } from '@/lib/utils';
import type { Lei, Page } from '@/types';

const categorias = [
  { id: '', label: 'Todos', icon: BookOpenIcon },
  { id: 'LEI', label: 'Leis', icon: ScaleIcon },
  { id: 'DECRETO', label: 'Decretos', icon: DocumentCheckIcon },
  { id: 'DECRETO_LEI', label: 'Decretos-Lei', icon: BookmarkIcon },
  { id: 'CONSTITUICAO', label: 'Constituição', icon: BuildingLibraryIcon },
  { id: 'CODIGO', label: 'Códigos', icon: DocumentTextIcon },
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  VIGENTE:               { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  REVOGADA:              { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
  PARCIALMENTE_REVOGADA: { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  SUSPENSA:              { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
};

export default function LegislacaoPage() {
  const router = useRouter();
  const [data, setData] = useState<Page<Lei> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('busca', search);
      if (tipoFilter) params.append('tipo', tipoFilter);
      params.append('size', '20');
      const response = await api.get<Page<Lei>>(`/leis?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar legislação:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, tipoFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Legislação"
        subtitle="Base de dados de leis e regulamentos penais de Angola"
        icon={BuildingLibraryIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Legislação' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/legislacao/revisao">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ClockIcon className="h-3.5 w-3.5" />
                Revisão de Leis
              </button>
            </Link>
            <Link href="/legislacao/artigos/revisao">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DocumentCheckIcon className="h-3.5 w-3.5" />
                Revisão de Artigos
              </button>
            </Link>
            <Link href="/legislacao/artigos/novo">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DocumentPlusIcon className="h-3.5 w-3.5" />
                Novo Artigo
              </button>
            </Link>
            <Link href="/legislacao/novo">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] transition-colors">
                <PlusIcon className="h-3.5 w-3.5" />
                Nova Lei
              </button>
            </Link>
          </div>
        }
      />

      {/* Barra de pesquisa */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por título, número ou conteúdo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
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
        {data && (
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold text-gray-900">{data.totalElements}</p>
            <p className="text-xs text-gray-400">documentos</p>
          </div>
        )}
      </div>

      {/* Filtros por categoria */}
      <div className="flex items-center gap-2 flex-wrap">
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const isActive = tipoFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setTipoFilter(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                isActive
                  ? 'bg-[#1a2744] text-white border-[#1a2744]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">A carregar legislação...</p>
        </div>
      ) : data && data.content.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-[1fr_120px_120px_100px_36px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Diploma</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Publicação</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</p>
            <div />
          </div>

          {/* Linhas */}
          {data.content.map((lei) => {
            const status = statusStyles[lei.status] ?? statusStyles.REVOGADA;
            return (
              <div
                key={lei.id}
                onClick={() => router.push(`/legislacao/${lei.id}`)}
                className="grid grid-cols-[1fr_120px_120px_100px_36px] gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 cursor-pointer transition-colors group"
              >
                {/* Diploma */}
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {lei.tipo} n.º {lei.numero}/{lei.ano}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{lei.titulo}</p>
                  </div>
                </div>

                {/* Tipo */}
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-md w-fit">
                  {lei.tipo}
                </span>

                {/* Data */}
                <p className="text-xs text-gray-500">
                  {lei.dataPublicacao ? formatDate(lei.dataPublicacao) : '—'}
                </p>

                {/* Estado */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {formatStatus(lei.status)}
                </span>

                {/* Seta */}
                <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-7 w-7 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Nenhum diploma encontrado</h3>
          <p className="text-xs text-gray-400 mb-5">Tente ajustar os filtros ou termos de pesquisa.</p>
          <button
            onClick={() => { setSearch(''); setTipoFilter(''); }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
            Página {data.number + 1} de {data.totalPages} · {data.totalElements} resultados
          </span>
        </div>
      )}
    </div>
  );
}
