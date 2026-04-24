'use client';

import { useState, useEffect } from 'react';
import {
  UsersIcon,
  PlusIcon,
  PencilIcon,
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
import { usuarioService, type Usuario, type CreateUsuarioRequest } from '@/services/usuario.service';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const ROLES = [
  { value: 'ADMIN',       label: 'Administrador', bg: '#FEF2F2', text: '#DC2626' },
  { value: 'JUIZ',        label: 'Juiz',          bg: '#F5F3FF', text: '#7C3AED' },
  { value: 'PROCURADOR',  label: 'Procurador',    bg: '#EFF6FF', text: '#1D4ED8' },
  { value: 'ADVOGADO',    label: 'Advogado',      bg: '#ECFDF5', text: '#059669' },
  { value: 'ESTUDANTE',   label: 'Estudante',     bg: '#FFFBEB', text: '#D97706' },
];

function RoleBadge({ role }: { role: string }) {
  const r = ROLES.find(x => x.value === role) ?? { label: role, bg: '#F3F4F6', text: '#6B7280' };
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ background: r.bg, color: r.text }}>
      {r.label}
    </span>
  );
}

const lblCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

export default function GestaoUtilizadoresPage() {
  const [utilizadores, setUtilizadores] = useState<Usuario[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busca,        setBusca]        = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [editando,     setEditando]     = useState<Usuario | null>(null);
  const [saving,       setSaving]       = useState(false);

  const [formData, setFormData] = useState<CreateUsuarioRequest>({
    email: '', senha: '', nome: '', role: 'ESTUDANTE',
  });

  useEffect(() => { carregarUtilizadores(); }, []);

  const carregarUtilizadores = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listar(0, 100);
      setUtilizadores(data.content);
    } catch { toast.error('Erro ao carregar utilizadores'); }
    finally { setLoading(false); }
  };

  const openModal = (u?: Usuario) => {
    if (u) {
      setEditando(u);
      setFormData({ email: u.email, senha: '', nome: u.nome, role: u.role });
    } else {
      setEditando(null);
      setFormData({ email: '', senha: '', nome: '', role: 'ESTUDANTE' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast.error('Nome e email são obrigatórios'); return;
    }
    if (!editando && !formData.senha) {
      toast.error('Senha é obrigatória para novo utilizador'); return;
    }
    setSaving(true);
    try {
      if (editando) {
        await usuarioService.atualizar(editando.id, { nome: formData.nome, role: formData.role });
        toast.success('Utilizador actualizado');
      } else {
        await usuarioService.criar(formData);
        toast.success('Utilizador criado');
      }
      setShowModal(false);
      carregarUtilizadores();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Erro ao guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma a eliminação deste utilizador?')) return;
    try {
      await usuarioService.remover(id);
      toast.success('Utilizador removido');
      carregarUtilizadores();
    } catch { toast.error('Erro ao eliminar'); }
  };

  const handleToggleAtivo = async (u: Usuario) => {
    try {
      await usuarioService.toggleAtivo(u.id);
      toast.success(u.ativo ? 'Utilizador desactivado' : 'Utilizador activado');
      carregarUtilizadores();
    } catch { toast.error('Erro ao alterar estado'); }
  };

  const filtrados = utilizadores.filter(u =>
    !busca || u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Gestão de Utilizadores"
        subtitle="Administração de contas e permissões do sistema"
        icon={UsersIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Utilizadores' },
        ]}
        actions={
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] transition-colors"
          >
            <PlusIcon className="h-4 w-4" /> Novo Utilizador
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',       value: utilizadores.length,                             color: '#1a2744' },
          { label: 'Activos',     value: utilizadores.filter(u => u.ativo).length,         color: '#059669' },
          { label: 'Inactivos',   value: utilizadores.filter(u => !u.ativo).length,        color: '#DC2626' },
          { label: 'Admins',      value: utilizadores.filter(u => u.role === 'ADMIN').length, color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de pesquisa */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className={inputCls + ' pl-9'}
          />
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0">{filtrados.length} utilizador{filtrados.length !== 1 ? 'es' : ''}</p>
      </div>

      {/* Tabela */}
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
          <div className="grid grid-cols-[1fr_200px_130px_100px_120px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {['Utilizador', 'Email', 'Função', 'Estado', 'Acções'].map(h => (
              <p key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</p>
            ))}
          </div>

          {filtrados.map(u => (
            <div key={u.id} className="grid grid-cols-[1fr_200px_130px_100px_120px] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
              {/* Utilizador */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
                    {u.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.nome}</p>
                  {u.ultimoLogin && (
                    <p className="text-xs text-gray-400">Último login: {formatDate(u.ultimoLogin)}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <p className="text-xs text-gray-500 truncate">{u.email}</p>

              {/* Função */}
              <RoleBadge role={u.role} />

              {/* Estado */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
                u.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {u.ativo ? <CheckCircleIcon className="h-3 w-3" /> : <XCircleIcon className="h-3 w-3" />}
                {u.ativo ? 'Activo' : 'Inactivo'}
              </span>

              {/* Acções */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openModal(u)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleToggleAtivo(u)}
                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                  title={u.ativo ? 'Desactivar' : 'Activar'}
                >
                  {u.ativo ? <XCircleIcon className="h-3.5 w-3.5" /> : <CheckCircleIcon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal criar/editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md">
            <div className="h-[3px] angola-stripe rounded-t-xl" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-[#1a2744]" />
                <p className="text-sm font-semibold text-gray-800">
                  {editando ? 'Editar Utilizador' : 'Novo Utilizador'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={lblCls}>Nome completo *</label>
                <input type="text" placeholder="Nome do utilizador" value={formData.nome}
                  onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={lblCls}>Email institucional *</label>
                <input type="email" placeholder="utilizador@tribunal.gov.ao" value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  disabled={!!editando} className={inputCls + (editando ? ' opacity-60 cursor-not-allowed' : '')} />
              </div>
              {!editando && (
                <div>
                  <label className={lblCls}>Senha *</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={formData.senha}
                    onChange={e => setFormData(p => ({ ...p, senha: e.target.value }))}
                    className={inputCls} />
                </div>
              )}
              <div>
                <label className={lblCls}>Função *</label>
                <select value={formData.role}
                  onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                  className={inputCls}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] disabled:opacity-60 transition-colors">
                {saving ? <><Spinner size="sm" /> A guardar...</> : editando ? 'Actualizar' : 'Criar Utilizador'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
