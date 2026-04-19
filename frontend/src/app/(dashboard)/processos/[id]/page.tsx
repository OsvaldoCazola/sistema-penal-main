'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, CardHeader, Badge, Spinner } from '@/components/ui';
import { processoService } from '@/services/processo.service';
import { formatDate, formatDateTime, getStatusColor, formatStatus } from '@/lib/utils';
import type { Processo, TimelineResponse } from '@/types';

export default function ProcessoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  useEffect(() => {
    const fetchProcesso = async () => {
      try {
        const data = await processoService.buscarPorId(params.id as string);
        setProcesso(data);
      } catch (error) {
        console.error('Erro ao carregar processo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTimeline = async () => {
      try {
        const data = await processoService.buscarTimeline(params.id as string);
        setTimeline(data);
      } catch (error) {
        console.error('Erro ao carregar timeline:', error);
      } finally {
        setLoadingTimeline(false);
      }
    };

    if (params.id) {
      fetchProcesso();
      fetchTimeline();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Processo não encontrado</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Processo ${processo.numero}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Processos', href: '/processos' },
          { label: processo.numero },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-5 w-5" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/processos/${processo.id}/editar`)}>
              <PencilIcon className="h-5 w-5" />
              Editar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Visual */}
          {timeline && (
            <Card>
              <CardHeader 
                title="Linha do Tempo do Processo" 
                subtitle={`${timeline.percentualConcluido}% concluído`}
              />
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-green-500 -z-10 transition-all duration-500" 
                  style={{ width: `${timeline.percentualConcluido}%` }} 
                />
                <div className="flex justify-between overflow-x-auto pb-4">
                  {timeline.etapas.map((etapa, index) => (
                    <div key={etapa.codigo} className="flex flex-col items-center min-w-[80px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                        etapa.status === 'CONCLUIDA' ? 'bg-green-500 border-green-500 text-white' :
                        etapa.status === 'EM_ANDAMENTO' ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :
                        'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {etapa.status === 'CONCLUIDA' ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : etapa.status === 'EM_ANDAMENTO' ? (
                          <PlayCircleIcon className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-bold">{etapa.ordem}</span>
                        )}
                      </div>
                      <p className={`text-xs mt-2 text-center font-medium ${
                        etapa.status !== 'PENDENTE' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {etapa.nome}
                      </p>
                      {etapa.duracaoDias && (
                        <p className="text-xs text-gray-500">{etapa.duracaoDias} dias</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Informações do Processo"
              action={<Badge className={getStatusColor(processo.status)}>{formatStatus(processo.status)}</Badge>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de Crime</p>
                  <p className="font-medium text-gray-900">{processo.tipoCrime?.nome || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Data de Abertura</p>
                  <p className="font-medium text-gray-900">{formatDate(processo.dataAbertura)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Local do Fato</p>
                  <p className="font-medium text-gray-900">{processo.localFato || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Província</p>
                  <p className="font-medium text-gray-900">{processo.provincia || '-'}</p>
                </div>
              </div>
            </div>
            {processo.descricaoFatos && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Descrição dos Fatos</p>
                <p className="text-gray-700 whitespace-pre-wrap">{processo.descricaoFatos}</p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Partes do Processo" />
            {(!processo.partes || processo.partes.length === 0) ? (
              <p className="text-gray-500 text-center py-8">Nenhuma parte registrada</p>
            ) : (
              <div className="space-y-4">
                {processo.partes.map((parte, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{parte.nome}</p>
                        <Badge variant="info" size="sm">{parte.tipo}</Badge>
                      </div>
                  {parte.documento && (
                        <p className="text-sm text-gray-500 mt-1">
                          {parte.tipoDocumento || 'Documento'}: {parte.documento}
                        </p>
                      )}
                      {parte.advogadoNome && (
                        <p className="text-sm text-gray-500 mt-1">
                          Advogado: {parte.advogadoNome} (OAB: {parte.advogadoOab || 'N/A'})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Movimentações" />
            {(!processo.movimentacoes || processo.movimentacoes.length === 0) ? (
              <p className="text-gray-500 text-center py-8">Nenhuma movimentação</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                {processo.movimentacoes.map((mov) => (
                  <div key={mov.id} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary-500" />
                    <p className="text-sm font-medium text-gray-900">{mov.tipoEvento || 'Movimentação'}</p>
                    <p className="text-sm text-gray-600 mt-1">{mov.descricao || '-'}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDateTime(mov.dataEvento)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
