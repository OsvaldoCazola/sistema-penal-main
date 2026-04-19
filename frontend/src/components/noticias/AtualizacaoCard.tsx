'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CalendarIcon, ArrowRightIcon, BookOpenIcon, ScaleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Atualizacao } from '@/services/noticia.service';

interface AtualizacaoCardProps {
  atualizacao: Atualizacao;
}

// Ícones por tipo de atualização
const getIconByTipo = (tipo: string) => {
  switch (tipo) {
    case 'NOVA_LEI':
      return <BookOpenIcon className="h-5 w-5" />;
    case 'ALTERACAO_ARTIGO':
      return <DocumentTextIcon className="h-5 w-5" />;
    case 'NOVA_JURISPRUDENCIA':
      return <ScaleIcon className="h-5 w-5" />;
    case 'ATUALIZACAO_LEGISLATIVA':
      return <DocumentTextIcon className="h-5 w-5" />;
    default:
      return <DocumentTextIcon className="h-5 w-5" />;
  }
};

// Cores por tipo de atualização
const getColorsByTipo = (tipo: string) => {
  switch (tipo) {
    case 'NOVA_LEI':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      };
    case 'ALTERACAO_ARTIGO':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'bg-amber-100 text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
      };
    case 'NOVA_JURISPRUDENCIA':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'bg-purple-100 text-purple-600',
        badge: 'bg-purple-100 text-purple-700',
      };
    case 'ATUALIZACAO_LEGISLATIVA':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'bg-green-100 text-green-600',
        badge: 'bg-green-100 text-green-700',
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'bg-gray-100 text-gray-600',
        badge: 'bg-gray-100 text-gray-700',
      };
  }
};

export default function AtualizacaoCard({ atualizacao }: AtualizacaoCardProps) {
  const router = useRouter();
  const colors = getColorsByTipo(atualizacao.tipo);
  const icon = getIconByTipo(atualizacao.tipo);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('returnUrl', atualizacao.link);
    router.push('/login');
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`group block ${colors.bg} border ${colors.border} rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        {/* Ícone do tipo */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${colors.icon}`}>
          {icon}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Badge do tipo e data */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
              {atualizacao.tipoLabel}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(atualizacao.dataPublicacao)}
            </span>
          </div>

          {/* Título */}
          <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
            {atualizacao.titulo}
          </h4>

          {/* Descrição */}
          {atualizacao.descricao && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {atualizacao.descricao}
            </p>
          )}
        </div>

        {/* Setas de navegação */}
        <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </div>
    </a>
  );
}

// Componente para listar atualizações
interface AtualizacaoListProps {
  atualizacoes: Atualizacao[];
  titulo?: string;
}

export function AtualizacaoList({ atualizacoes, titulo }: AtualizacaoListProps) {
  if (atualizacoes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Nenhuma atualização encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {titulo}
        </h3>
      )}
      {atualizacoes.map((atualizacao) => (
        <AtualizacaoCard key={atualizacao.id} atualizacao={atualizacao} />
      ))}
    </div>
  );
}
