'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CalendarIcon, ArrowRightIcon, BookOpenIcon, ScaleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Atualizacao } from '@/services/noticia.service';

interface AtualizacaoCardProps {
  atualizacao: Atualizacao;
}

const getIconByTipo = (tipo: string) => {
  switch (tipo) {
    case 'NOVA_LEI':               return <BookOpenIcon className="h-5 w-5" />;
    case 'ALTERACAO_ARTIGO':       return <DocumentTextIcon className="h-5 w-5" />;
    case 'NOVA_JURISPRUDENCIA':    return <ScaleIcon className="h-5 w-5" />;
    case 'ATUALIZACAO_LEGISLATIVA':return <DocumentTextIcon className="h-5 w-5" />;
    default:                       return <DocumentTextIcon className="h-5 w-5" />;
  }
};

/* Cores que funcionam em modo claro e escuro via opacidade */
const getColorsByTipo = (tipo: string) => {
  switch (tipo) {
    case 'NOVA_LEI':
      return { accent: '#3b82f6', badgeBg: 'rgba(59,130,246,0.12)', badgeText: '#3b82f6' };
    case 'ALTERACAO_ARTIGO':
      return { accent: '#f59e0b', badgeBg: 'rgba(245,158,11,0.12)', badgeText: '#d97706' };
    case 'NOVA_JURISPRUDENCIA':
      return { accent: '#8b5cf6', badgeBg: 'rgba(139,92,246,0.12)', badgeText: '#8b5cf6' };
    case 'ATUALIZACAO_LEGISLATIVA':
      return { accent: '#10b981', badgeBg: 'rgba(16,185,129,0.12)', badgeText: '#10b981' };
    default:
      return { accent: '#6b7280', badgeBg: 'rgba(107,114,128,0.12)', badgeText: '#6b7280' };
  }
};

export default function AtualizacaoCard({ atualizacao }: AtualizacaoCardProps) {
  const router = useRouter();
  const colors = getColorsByTipo(atualizacao.tipo);
  const icon   = getIconByTipo(atualizacao.tipo);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('returnUrl', atualizacao.link);
    router.push('/login');
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="group block rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor:     'var(--border)',
        borderLeft:      `3px solid ${colors.accent}`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: colors.badgeBg, color: colors.accent }}>
          {icon}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}>
              {atualizacao.tipoLabel}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <CalendarIcon className="h-3 w-3" />
              {formatDate(atualizacao.dataPublicacao)}
            </span>
          </div>

          <h4 className="font-semibold line-clamp-1 transition-colors" style={{ color: 'var(--text-primary)' }}>
            {atualizacao.titulo}
          </h4>

          {atualizacao.descricao && (
            <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {atualizacao.descricao}
            </p>
          )}
        </div>

        <ArrowRightIcon className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-all"
          style={{ color: 'var(--text-muted)' }} />
      </div>
    </a>
  );
}

/* ── Lista de atualizações ────────────────────────────────────────────────── */
interface AtualizacaoListProps {
  atualizacoes: Atualizacao[];
  titulo?: string;
}

export function AtualizacaoList({ atualizacoes, titulo }: AtualizacaoListProps) {
  if (atualizacoes.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        <DocumentTextIcon className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--border)' }} />
        <p>Nenhuma actualização encontrada</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {titulo && <h3 className="section-header">{titulo}</h3>}
      {atualizacoes.map(a => <AtualizacaoCard key={a.id} atualizacao={a} />)}
    </div>
  );
}
