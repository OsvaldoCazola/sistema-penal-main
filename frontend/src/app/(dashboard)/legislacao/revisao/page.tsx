'use client';

import { useEffect, useState } from 'react';
import { lawMonitoringService, LawUpdateResponse } from '@/services';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
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
  const [mostrarModalRejeitar, setMostrarModalRejeitar] = useState(false);
  const [leiSelecionada, setLeiSelecionada] = useState<LawUpdateResponse | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [processando, setProcessando] = useState(false);

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

  useEffect(() => { carregarLeisPendentes(); }, []);

  const handleAprovar = async (lei: LawUpdateResponse) => {
    if (!user) return;
    try {
      setProcessando(true);
      await lawMonitoringService.aprovarLei(lei.id, user?.nome || 'Admin');
      await carregarLeisPendentes(paginaAtual);
    } catch (error) {
      console.error('Erro ao aprovar lei:', error);
      alert('Erro ao aprovar lei. Tente novamente.');
    } finally { setProcessando(false); }
  };

  const handlePrepararRejeitar = (lei: LawUpdateResponse) => {
    setLeiSelecionada(lei);
    setMotivoRejeicao('');
    setMostrarModalRejeitar(true);
  };

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
    } finally { setProcessando(false); }
  };

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':  return <Badge variant="warning">Pendente</Badge>;
      case 'APROVADO':  return <Badge variant="success">Aprovado</Badge>;
      case 'REJEITADO': return <Badge variant="danger">Rejeitado</Badge>;
      default:          return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Revisão de Leis Pendentes
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Revise e aprove as leis descobertas pelo monitoramento automático ou adicionadas manualmente
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => carregarLeisPendentes(paginaAtual)} disabled={loading}>
            Actualizar
          </Button>
          <Link href="/legislacao">
            <Button variant="outline">Voltar à Legislação</Button>
          </Link>
        </div>
      </div>

      {/* ── Estatísticas — SEM painel Híbrido ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5" style={{ backgroundColor:'var(--bg-surface)', borderColor:'var(--border)' }}>
          <div className="text-2xl font-bold text-orange-500">{totalElementos}</div>
          <div className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Leis Pendentes</div>
        </div>
        <div className="rounded-xl border p-5" style={{ backgroundColor:'var(--bg-surface)', borderColor:'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Leis</div>
          <div className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Aguardando Revisão</div>
        </div>
      </div>

      {/* ── Lista de Leis Pendentes ────────────────────────────────────── */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor:'var(--bg-surface)', borderColor:'var(--border)' }}>
        {/* Header do card */}
        <div className="px-5 py-4 border-b" style={{ borderColor:'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ color:'var(--text-primary)' }}>
            Leis Pendentes de Aprovação
          </h2>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-8" style={{ color:'var(--text-muted)' }}>A carregar...</div>
          ) : leisPendentes.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color:'var(--text-muted)' }} className="mb-2">Nenhuma lei pendente de aprovação</p>
              <p className="text-sm" style={{ color:'var(--text-muted)' }}>
                O sistema verificará automaticamente por novas leis
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {leisPendentes.map(lei => (
                  <div
                    key={lei.id}
                    className="rounded-lg border p-4 transition-colors"
                    style={{ borderColor:'var(--border)', backgroundColor:'var(--bg-surface-2)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-lg" style={{ color:'var(--text-primary)' }}>
                            {lei.tipo} {lei.numero}/{lei.ano}
                          </span>
                          {getStatusBadge(lei.status)}
                        </div>
                        <h3 className="font-medium mb-1" style={{ color:'var(--text-primary)' }}>{lei.titulo}</h3>
                        {lei.descricao && (
                          <p className="text-sm mb-2" style={{ color:'var(--text-secondary)' }}>{lei.descricao}</p>
                        )}
                        <div className="flex gap-4 text-xs" style={{ color:'var(--text-muted)' }}>
                          <span>Fonte: {lei.fonteOrigem}</span>
                          <span>Descoberta: {formatarData(lei.dataDescoberta)}</span>
                          {lei.urlOriginal && (
                            <a href={lei.urlOriginal} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Ver Original
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="primary" size="sm" onClick={() => handleAprovar(lei)} disabled={processando}>Aprovar</Button>
                        <Button variant="danger"  size="sm" onClick={() => handlePrepararRejeitar(lei)} disabled={processando}>Rejeitar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button variant="outline" size="sm" onClick={() => carregarLeisPendentes(paginaAtual - 1)} disabled={paginaAtual === 0}>Anterior</Button>
                  <span className="text-sm" style={{ color:'var(--text-secondary)' }}>Página {paginaAtual + 1} de {totalPaginas}</span>
                  <Button variant="outline" size="sm" onClick={() => carregarLeisPendentes(paginaAtual + 1)} disabled={paginaAtual >= totalPaginas - 1}>Próxima</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Rejeição */}
      <Modal isOpen={mostrarModalRejeitar} onClose={() => setMostrarModalRejeitar(false)} title="Rejeitar Lei">
        <div className="space-y-4">
          <div>
            <p className="font-medium" style={{ color:'var(--text-primary)' }}>
              {leiSelecionada?.tipo} {leiSelecionada?.numero}/{leiSelecionada?.ano}
            </p>
            <p className="text-sm" style={{ color:'var(--text-secondary)' }}>{leiSelecionada?.titulo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color:'var(--text-secondary)' }}>
              Motivo da Rejeição *
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explique o motivo da rejeição..."
              value={motivoRejeicao}
              onChange={e => setMotivoRejeicao(e.target.value)}
              style={{ backgroundColor:'var(--input-bg)', borderColor:'var(--input-border)', color:'var(--input-text)' }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMostrarModalRejeitar(false)} disabled={processando}>Cancelar</Button>
            <Button variant="danger" onClick={handleConfirmarRejeitar} disabled={processando || !motivoRejeicao.trim()}>
              {processando ? 'A processar...' : 'Confirmar Rejeição'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
