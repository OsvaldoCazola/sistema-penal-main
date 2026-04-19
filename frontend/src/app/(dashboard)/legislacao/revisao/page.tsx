'use client';

import { useEffect, useState } from 'react';
import { lawMonitoringService, LawUpdateResponse } from '@/services';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function RevisaoLeisPage() {
  const { user } = useAuth();
  const [leisPendentes, setLeisPendentes] = useState<LawUpdateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  
  // Modal de rejeição
  const [mostrarModalRejeitar, setMostrarModalRejeitar] = useState(false);
  const [leiSelecionada, setLeiSelecionada] = useState<LawUpdateResponse | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [processando, setProcessando] = useState(false);

  // Carregar leis pendentes
  const carregarLeisPendentes = async (pagina = 0) => {
    try {
      setLoading(true);
      const response = await lawMonitoringService.listarPendentes(pagina, 10);
      setLeisPendentes(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setPaginaAtual(pagina);
    } catch (error) {
      console.error('Erro ao carregar leis pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLeisPendentes();
  }, []);

  // Aprovar lei
  const handleAprovar = async (lei: LawUpdateResponse) => {
    if (!user) return;
    
    try {
      setProcessando(true);
      await lawMonitoringService.aprovarLei(lei.id, user?.nome || 'Admin');
      await carregarLeisPendentes(paginaAtual);
    } catch (error) {
      console.error('Erro ao aprovar lei:', error);
      alert('Erro ao aprovar lei. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  // Preparar rejeição
  const handlePrepararRejeitar = (lei: LawUpdateResponse) => {
    setLeiSelecionada(lei);
    setMotivoRejeicao('');
    setMostrarModalRejeitar(true);
  };

  // Confirmar rejeição
  const handleConfirmarRejeitar = async () => {
    if (!leiSelecionada || !motivoRejeicao.trim()) return;

    try {
      setProcessando(true);
      await lawMonitoringService.rejeitarLei(leiSelecionada.id, motivoRejeicao);
      setMostrarModalRejeitar(false);
      setLeiSelecionada(null);
      await carregarLeisPendentes(paginaAtual);
    } catch (error) {
      console.error('Erro ao rejeitar lei:', error);
      alert('Erro ao rejeitar lei. Tente novamente.');
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
          <h1 className="text-2xl font-bold">Revisão de Leis Pendentes</h1>
          <p className="text-gray-600 mt-1">
            Revise e aprove as leis descobertas pelo monitoramento automático ou adicionadas manualmente
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => carregarLeisPendentes(paginaAtual)}
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
            <div className="text-sm text-gray-600">Leis Pendentes</div>
          </div>
        </Card>
        <Card>
          <div className="pt-4">
            <div className="text-2xl font-bold">Leis</div>
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

      {/* Lista de Leis Pendentes */}
      <Card title="Leis Pendentes de Aprovação">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : leisPendentes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma lei pendente de aprovação</p>
            <p className="text-sm text-gray-400">
              O sistema de monitoramento verificará automaticamente por novas leis
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {leisPendentes.map((lei) => (
                <div 
                  key={lei.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-lg">
                          {lei.tipo} {lei.numero}/{lei.ano}
                        </span>
                        {getStatusBadge(lei.status)}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{lei.titulo}</h3>
                      {lei.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{lei.descricao}</p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Fonte: {lei.fonteOrigem}</span>
                        <span>Descoberta: {formatarData(lei.dataDescoberta)}</span>
                        {lei.urlOriginal && (
                          <a 
                            href={lei.urlOriginal} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver Original
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAprovar(lei)}
                        disabled={processando}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handlePrepararRejeitar(lei)}
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
                  onClick={() => carregarLeisPendentes(paginaAtual - 1)}
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
                  onClick={() => carregarLeisPendentes(paginaAtual + 1)}
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
        title="Rejeitar Lei"
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium">
              {leiSelecionada?.tipo} {leiSelecionada?.numero}/{leiSelecionada?.ano}
            </p>
            <p className="text-sm text-gray-600">{leiSelecionada?.titulo}</p>
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
