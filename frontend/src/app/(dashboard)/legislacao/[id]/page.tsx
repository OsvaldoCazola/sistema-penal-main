'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  LockClosedIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Badge, Spinner, Button } from '@/components/ui';
import { legislacaoService, Lei, Artigo, LeiIntegridade, ElementoJuridico, Penalidade, CategoriaCrime } from '@/services/legislacao.service';
import { formatDate } from '@/lib/utils';

export default function LeiDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const leiId = params.id as string;

  const [lei, setLei] = useState<Lei | null>(null);
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [integridade, setIntegridade] = useState<LeiIntegridade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [artigoSelecionado, setArtigoSelecionado] = useState<Artigo | null>(null);
  const [elementosVisiveis, setElementosVisiveis] = useState<Record<string, boolean>>({});
  const [penalidadesVisiveis, setPenalidadesVisiveis] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const leiData = await legislacaoService.buscarLei(leiId);
      setLei(leiData);
      
      const artigosData = await legislacaoService.listarArtigos(leiId);
      setArtigos(artigosData);
      
      try {
        const integridadeData = await legislacaoService.buscarIntegridade(leiId);
        setIntegridade(integridadeData);
      } catch (e) {
        console.log('Integridade não disponível');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [leiId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleElementos = (artigoId: string) => {
    setElementosVisiveis(prev => ({ ...prev, [artigoId]: !prev[artigoId] }));
  };

  const togglePenalidades = (artigoId: string) => {
    setPenalidadesVisiveis(prev => ({ ...prev, [artigoId]: !prev[artigoId] }));
  };

  const getTipoPenalColor = (tipo?: string) => {
    const cores: Record<string, string> = {
      'DOLOSO': 'bg-red-100 text-red-700',
      'CULPOSO': 'bg-amber-100 text-amber-700',
    };
    return tipo ? cores[tipo.toUpperCase()] || 'bg-gray-100 text-gray-700' : '';
  };

  const getPenaMinMax = (artigo: Artigo) => {
    if (artigo.penaMinAnos && artigo.penaMaxAnos) {
      return `${artigo.penaMinAnos} a ${artigo.penaMaxAnos} anos`;
    }
    if (artigo.penaMinAnos) {
      return `Mínimo: ${artigo.penaMinAnos} anos`;
    }
    if (artigo.penaMaxAnos) {
      return `Máximo: ${artigo.penaMaxAnos} anos`;
    }
    return null;
  };

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    VIGENTE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    REVOGADA: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
    PARCIALMENTE_REVOGADA: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    SUSPENSA: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 animate-pulse">A carregar legislação...</p>
      </div>
    );
  }

  if (!lei) {
    return (
      <div className="text-center py-16">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Legislação não encontrada</h3>
        <Button variant="outline" onClick={() => router.push('/legislacao')}>
          Voltar à legislação
        </Button>
      </div>
    );
  }

  const status = statusStyles[lei.status] || statusStyles.REVOGADA;

  return (
    <div>
      <PageHeader
        title={`${lei.tipo} nº ${lei.numero}/${lei.ano}`}
        subtitle={lei.titulo}
        breadcrumbs={[
          { label: 'Legislação', href: '/legislacao' },
          { label: `${lei.tipo} nº ${lei.numero}/${lei.ano}` },
        ]}
      />

      {/* Informações da Lei */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card Principal */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-50 rounded-md">
                    <ScaleIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold">
                      {lei.tipo}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ml-2 ${status.bg} ${status.text}`}>
                      {lei.status === 'VIGENTE' && <CheckCircleIcon className="h-4 w-4" />}
                      {lei.status}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lei.titulo}</h1>
              
              {lei.ementa && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ementa</h3>
                  <p className="text-gray-700 leading-relaxed">{lei.ementa}</p>
                </div>
              )}

              {lei.conteudo && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Conteúdo</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{lei.conteudo}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                {lei.dataPublicacao && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpenIcon className="h-4 w-4" />
                    <span>Publicação: {formatDate(lei.dataPublicacao)}</span>
                  </div>
                )}
                {lei.dataVigencia && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>Vigência: {formatDate(lei.dataVigencia)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Card de Integridade */}
        <div>
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Integridade</h3>
              </div>
              
              {integridade ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                    <span className="text-emerald-700 font-medium">Verificado</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Hash SHA-256:</p>
                    <code className="block mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                      {integridade.hash.substring(0, 32)}...
                    </code>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Última verificação: {formatDate(integridade.dataVerificacao)}</p>
                    <p>Versão: {integridade.versaoLei}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <LockClosedIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Integridade não verificada</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Artigos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
            Artigos ({artigos.length})
          </h2>
        </div>

        {artigos.length === 0 ? (
          <Card className="p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum artigo encontrado nesta lei</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {artigos.map((artigo) => (
              <Card key={artigo.id} className="overflow-hidden">
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setArtigoSelecionado(artigo)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                        <span className="text-primary-700 font-bold">{artigo.numero}</span>
                      </div>
                      <div>
                        {artigo.titulo && (
                          <h3 className="font-semibold text-gray-900">{artigo.titulo}</h3>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {artigo.tipoPenal && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTipoPenalColor(artigo.tipoPenal)}`}>
                              {artigo.tipoPenal}
                            </span>
                          )}
                          {artigo.penaMinAnos || artigo.penaMaxAnos ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">
                              <ScaleIcon className="h-3 w-3" />
                              {getPenaMinMax(artigo)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <ArrowLeftIcon className="h-5 w-5 text-gray-400 rotate-180" />
                  </div>
                  
                  <p className="mt-3 text-gray-600 line-clamp-3">{artigo.conteudo}</p>

                  {/* Badges de elementos e penalidades */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(artigo.elementosJuridicos && artigo.elementosJuridicos.length > 0) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleElementos(artigo.id); }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100"
                      >
                        <EyeIcon className="h-3 w-3" />
                        {artigo.elementosJuridicos.length} elementos
                      </button>
                    )}
                    {(artigo.penalidades && artigo.penalidades.length > 0) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePenalidades(artigo.id); }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium hover:bg-amber-100"
                      >
                        <ScaleIcon className="h-3 w-3" />
                        {artigo.penalidades.length} penalidades
                      </button>
                    )}
                    {(artigo.categorias && artigo.categorias.length > 0) && (
                      <div className="flex flex-wrap gap-1">
                        {artigo.categorias.slice(0, 2).map((cat) => (
                          <span key={cat.id} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                            {cat.nome}
                          </span>
                        ))}
                        {(artigo.categorias.length > 2) && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            +{artigo.categorias.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Elementos Jurídicos Expansível */}
                {elementosVisiveis[artigo.id] && artigo.elementosJuridicos && artigo.elementosJuridicos.length > 0 && (
                  <div className="border-t border-gray-100 bg-blue-50/50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Elementos Jurídicos</h4>
                    <div className="space-y-3">
                      {artigo.elementosJuridicos.map((ej) => (
                        <div key={ej.id} className="bg-white rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              ej.tipo === 'ACAO' ? 'bg-blue-100 text-blue-700' :
                              ej.tipo === 'CONDICAO' ? 'bg-green-100 text-green-700' :
                              ej.tipo === 'PENA' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {ej.tipo}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{ej.conteudo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Penalidades Expansível */}
                {penalidadesVisiveis[artigo.id] && artigo.penalidades && artigo.penalidades.length > 0 && (
                  <div className="border-t border-gray-100 bg-amber-50/50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Penalidades</h4>
                    <div className="space-y-3">
                      {artigo.penalidades.map((p) => (
                        <div key={p.id} className="bg-white rounded-lg p-3 border border-amber-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                              {p.tipoPena}
                            </span>
                            {p.regime && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {p.regime}
                              </span>
                            )}
                          </div>
                          {(p.penaMinAnos || p.penaMaxAnos) && (
                            <p className="text-gray-700 text-sm">
                              <strong>Pena:</strong> {p.penaMinAnos || 0} a {p.penaMaxAnos || 0} anos
                            </p>
                          )}
                          {(p.multaMin || p.multaMax) && (
                            <p className="text-gray-700 text-sm">
                              <strong>Multa:</strong> {p.multaMin} a {p.multaMax}
                            </p>
                          )}
                          {p.descricao && (
                            <p className="text-gray-600 text-sm mt-1">{p.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Botão Voltar */}
      <div className="flex justify-start mb-8">
        <Button variant="outline" onClick={() => router.push('/legislacao')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar à legislação
        </Button>
      </div>
    </div>
  );
}
