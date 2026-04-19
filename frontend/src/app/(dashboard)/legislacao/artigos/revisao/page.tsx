'use client';

import { useEffect, useState } from 'react';
import { articleMonitoringService, ArtigoUpdateResponse } from '@/services';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function RevisaoArtigosPage() {
  const { user } = useAuth();
  const [artigosPendentes, setArtigosPendentes] = useState<ArtigoUpdateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  
  // Modal de rejeição
  const [mostrarModalRejeitar, setMostrarModalRejeitar] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState<ArtigoUpdateResponse | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [processando, setProcessando] = useState(false);

  // Carregar artigos pendentes
  const carregarArtigosPendentes = async (pagina = 0) => {
    try {
      setLoading(true);
      const response = await articleMonitoringService.listarPendentes(pagina, 10);
      setArtigosPendentes(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setPaginaAtual(pagina);
    } catch (error) {
      console.error('Erro ao carregar artigos pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarArtigosPendentes();
  }, []);

  // Aprovar artigo
  const handleAprovar = async (artigo: ArtigoUpdateResponse) => {
    if (!user) return;
    
    try {
      setProcessando(true);
      await articleMonitoringService.aprovarArtigo(artigo.id, user?.nome || 'Admin');
      await carregarArtigosPendentes(paginaAtual);
    } catch (error) {
      console.error('Erro ao aprovar artigo:', error);
      alert('Erro ao aprovar artigo. Verifique se a lei associada existe.');
    } finally {
      setProcessando(false);
    }
  };

  // Preparar rejeição
  const handlePrepararRejeitar = (artigo: ArtigoUpdateResponse) => {
    setArtigoSelecionado(artigo);
    setMotivoRejeicao('');
    setMostrarModalRejeitar(true);
  };

  // Confirmar rejeição
  const handleConfirmarRejeitar = async () => {
    if (!artigoSelecionado || !motivoRejeicao.trim()) return;

    try {
      setProcessando(true);
      await articleMonitoringService.rejeitarArtigo(artigoSelecionado.id, motivoRejeicao);
      setMostrarModalRejeitar(false);
      setArtigoSelecionado(null);
      await carregarArtigosPendentes(paginaAtual);
    } catch (error) {
      console.error('Erro ao rejeitar artigo:', error);
      alert('Erro ao rejeitar artigo. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Badge variant="warning">Pendente</Badge>;
      case 'APROVADO':
        return <Badge variant="success">Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge variant="danger">Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revisão de Artigos Pendentes</h1>
          <p className="text-gray-600 mt-1">
            Revise e aprove os artigos descobertos pelo monitoramento automático ou adicionados manualmente
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => carregarArtigosPendentes(paginaAtual)}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Link href="/legislacao">
            <Button variant="outline">Voltar à Legislação</Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{totalElementos}</div>
            <div className="text-sm text-gray-600">Artigos Pendentes</div>
          </div>
        </Card>
        <Card>
          <div className="pt-4">
            <div className="text-2xl font-bold">Artigos</div>
            <div className="text-sm text-gray-600">Aguardando Revisão</div>
          </div>
        </Card>
        <Card>
          <div className="pt-4">
            <div className="text-2xl font-bold text-blue-600">Híbrido</div>
            <div className="text-sm text-gray-600">Modo de Operação</div>
          </div>
        </Card>
      </div>

      {/* Lista de Artigos Pendentes */}
      <Card title="Artigos Pendentes de Aprovação">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : artigosPendentes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum artigo pendente de aprovação</p>
            <p className="text-sm text-gray-400">
              O sistema de monitoramento verificará automaticamente por novos artigos
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {artigosPendentes.map((artigo) => (
                <div 
                  key={artigo.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-lg">
                          Art. {artigo.numeroArtigo || 'N/A'}
                        </span>
                        {getStatusBadge(artigo.status)}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{artigo.titulo}</h3>
                      {artigo.nomeSecao && (
                        <p className="text-sm text-gray-600 mb-2">Seção: {artigo.nomeSecao}</p>
                      )}
                      <div className="text-sm text-gray-700 mb-2 line-clamp-3">
                        {artigo.conteudo?.substring(0, 200)}...
                      </div>
                      {artigo.leiIdentificacao && (
                        <p className="text-xs text-gray-500">
                          Lei: {artigo.leiIdentificacao}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span>Fonte: {artigo.fonteOrigem}</span>
                        <span>Descoberto: {formatarData(artigo.dataDescoberta)}</span>
                        {artigo.fonteUrl && (
                          <a 
                            href={artigo.fonteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver Original
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAprovar(artigo)}
                        disabled={processando}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handlePrepararRejeitar(artigo)}
                        disabled={processando}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => carregarArtigosPendentes(paginaAtual - 1)}
                  disabled={paginaAtual === 0}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {paginaAtual + 1} de {totalPaginas}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => carregarArtigosPendentes(paginaAtual + 1)}
                  disabled={paginaAtual >= totalPaginas - 1}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal de Rejeição */}
      <Modal 
        isOpen={mostrarModalRejeitar} 
        onClose={() => setMostrarModalRejeitar(false)}
        title="Rejeitar Artigo"
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium">
              Art. {artigoSelecionado?.numeroArtigo || 'N/A'} - {artigoSelecionado?.titulo}
            </p>
            {artigoSelecionado?.leiIdentificacao && (
              <p className="text-sm text-gray-600">Lei: {artigoSelecionado.leiIdentificacao}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Motivo da Rejeição *
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="Explique o motivo da rejeição..."
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setMostrarModalRejeitar(false)}
              disabled={processando}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmarRejeitar}
              disabled={processando || !motivoRejeicao.trim()}
            >
              {processando ? 'Processando...' : 'Confirmar Rejeição'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
