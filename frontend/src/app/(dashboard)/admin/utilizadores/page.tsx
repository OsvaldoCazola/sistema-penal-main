'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usuarioService, type Usuario, type CreateUsuarioRequest } from '@/services/usuario.service';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

type RoleOption = 'ADMIN' | 'ESTUDANTE';

const ROLE_META: Record<RoleOption, { label: string; bg: string; text: string }> = {
  ADMIN: { label: 'Administrador', bg: '#FEF2F2', text: '#DC2626' },
  ESTUDANTE: { label: 'Estudante', bg: '#FFFBEB', text: '#D97706' },
};

const lblCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

export default function GestaoUtilizadoresPage() {
  const [utilizadores, setUtilizadores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState<{ totalAtivos: number; admins: number; estudantes: number } | null>(null);
  const [formData, setFormData] = useState<CreateUsuarioRequest>({
    email: '',
    senha: '',
    nome: '',
    role: 'ESTUDANTE',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [page, estatisticas] = await Promise.all([
        usuarioService.listar(0, 100),
        usuarioService.estatisticas().catch(() => null),
      ]);
      setUtilizadores(page.content);
      setStats(estatisticas);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    if (!busca) return utilizadores;
    const termo = busca.toLowerCase();
    return utilizadores.filter((u) =>
      u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    );
  }, [utilizadores, busca]);

  const abrirModalCriacao = () => {
    setFormData({ email: '', senha: '', nome: '', role: 'ESTUDANTE' });
    setShowModal(true);
  };

  const handleCriar = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error('Preencha nome, email e senha');
      return;
    }
    setSaving(true);
    try {
      await usuarioService.criar(formData);
      toast.success('Utilizador criado com sucesso');
      setShowModal(false);
      carregarDados();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Erro ao criar utilizador');
    } finally {
      setSaving(false);
    }
  };

  const handleAlterarRole = async (id: string, role: RoleOption) => {
    try {
      await usuarioService.alterarRole(id, role);
      toast.success('Função actualizada');
      carregarDados();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Erro ao alterar função');
    }
  };

  const handleToggleAtivo = async (usuario: Usuario) => {
    try {
      await usuarioService.toggleAtivo(usuario);
      toast.success(usuario.ativo ? 'Utilizador desactivado' : 'Utilizador activado');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao alterar estado');
    }
  };

  const handleResetSenha = async (usuario: Usuario) => {
    const novaSenha = prompt(`Definir nova senha para ${usuario.nome}`);
    if (!novaSenha) return;
    try {
      await usuarioService.resetarSenha(usuario.id, novaSenha);
      toast.success('Senha redefinida com sucesso');
    } catch (error) {
      toast.error('Erro ao redefinir senha');
    }
  };

  const handleRemover = async (usuario: Usuario) => {
    if (!confirm(`Confirma a eliminação de ${usuario.nome}?`)) return;
    try {
      await usuarioService.excluir(usuario.id);
      toast.success('Utilizador removido');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao remover utilizador');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Gestão de Utilizadores"
        subtitle="Crie e acompanhe contas administrativas e de estudantes"
        icon={UsersIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Utilizadores' },
        ]}
        actions={
          <Button onClick={abrirModalCriacao} className="flex items-center gap-1.5">
            <PlusIcon className="h-4 w-4" /> Novo Utilizador
          </Button>
        }
      />

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total" value={utilizadores.length} color="#1a2744" />
        <StatsCard label="Activos" value={utilizadores.filter((u) => u.ativo).length} color="#059669" />
        <StatsCard label="Inactivos" value={utilizadores.filter((u) => !u.ativo).length} color="#DC2626" />
        <StatsCard label="Estudantes" value={utilizadores.filter((u) => u.role === 'ESTUDANTE').length} color="#D97706" />
      </div>

      {/* Pesquisa */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Pesquisar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">
          {filtrados.length} utilizador{filtrados.length === 1 ? '' : 'es'}
        </span>
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">A carregar utilizadores...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
          <UsersIcon className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Nenhum utilizador encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1.4fr_1.1fr_0.9fr_0.8fr_0.7fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
            <span>Utilizador</span>
            <span>Email</span>
            <span>Função</span>
            <span>Estado</span>
            <span>Acções</span>
          </div>

          {filtrados.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1.4fr_1.1fr_0.9fr_0.8fr_0.7fr] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
                  {u.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.nome}</p>
                  {u.ultimoLogin && (
                    <p className="text-xs text-gray-400">Último acesso: {formatDate(u.ultimoLogin)}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 truncate">{u.email}</p>

              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: ROLE_META[u.role as RoleOption]?.bg ?? '#E5E7EB', color: ROLE_META[u.role as RoleOption]?.text ?? '#374151' }}>
                  {ROLE_META[u.role as RoleOption]?.label ?? u.role}
                </Badge>
                <select
                  value={u.role}
                  onChange={(e) => handleAlterarRole(u.id, e.target.value as RoleOption)}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-gray-50"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="ESTUDANTE">Estudante</option>
                </select>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
                  u.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {u.ativo ? <CheckCircleIcon className="h-3 w-3" /> : <XCircleIcon className="h-3 w-3" />}
                {u.ativo ? 'Activo' : 'Inactivo'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleResetSenha(u)}
                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                  title="Redefinir senha"
                >
                  <KeyIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleToggleAtivo(u)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title={u.ativo ? 'Desactivar' : 'Activar'}
                >
                  {u.ativo ? <XCircleIcon className="h-3.5 w-3.5" /> : <CheckCircleIcon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => handleRemover(u)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remover"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md">
            <div className="h-[3px] angola-stripe rounded-t-xl" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-[#1a2744]" />
                <p className="text-sm font-semibold text-gray-800">Novo Utilizador</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={lblCls}>Nome completo *</label>
                <input
                  type="text"
                  placeholder="Nome do utilizador"
                  value={formData.nome}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={lblCls}>Email institucional *</label>
                <input
                  type="email"
                  placeholder="utilizador@instituicao.gov.ao"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={lblCls}>Senha temporária *</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.senha}
                  onChange={(e) => setFormData((prev) => ({ ...prev, senha: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={lblCls}>Função *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as RoleOption }))}
                  className={inputCls}
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="ESTUDANTE">Estudante</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCriar}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] disabled:opacity-60 transition-colors"
              >
                {saving ? (<><Spinner size="sm" /> A guardar...</>) : 'Criar Utilizador'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-1">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
