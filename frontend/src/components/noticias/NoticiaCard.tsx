'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import type { NoticiaSummary } from '@/services/noticia.service';

interface NoticiaCardProps {
  noticia: NoticiaSummary;
}

export default function NoticiaCard({ noticia }: NoticiaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Imagem */}
      {noticia.imagemUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={noticia.imagemUrl}
            alt={noticia.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {noticia.categoria && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
              {noticia.categoria}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-5">
        {/* Data e Autor */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(noticia.dataPublicacao)}</span>
          </div>
          {noticia.autor && (
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span>{noticia.autor}</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2 mb-2">
          {noticia.titulo}
        </h3>

        {/* Subtítulo ou Resumo */}
        {(noticia.subtitulo || noticia.resumo) && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {noticia.subtitulo || noticia.resumo}
          </p>
        )}

        {/* Link para ler mais */}
        <div className="mt-4 text-sm text-primary-600 font-medium group-hover:underline">
          Ler mais →
        </div>
      </div>
    </Link>
  );
}
