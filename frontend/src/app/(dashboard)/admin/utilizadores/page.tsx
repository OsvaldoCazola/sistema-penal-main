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
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Input, Badge } from '@/components/ui';
import { usuarioService, Usuario, CreateUsuarioRequest } from '@/services/usuario.service';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'ADMIN', label: 'Administrador', color: 'red' },
  { value: 'JUIZ', label: 'Juiz', color: 'purple' },
  { value: 'PROCURADOR', label: 'Procurador', color: 'blue' },
  { value: 'ADVOGADO', label: 'Advogado', color: 'green' },
  { value: 'ESTUDANTE', label: 'Estudante', color: 'yellow' },
  { value: 'PESQUISADOR', label: 'Pesquisador', color: 'cyan' },
  { value: 'FUNCIONARIO', label: 'Funcionário', color: 'gray' }
];

export default function GestaoUtilizadoresPage() {
  const [utilizadores, setUtilizadores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  
  // Formulário
  const [formData, setFormData] = useState<CreateUsuarioRequest>({
    email: '',
    senha: '',
    nome: '',
    role: 'ESTUDANTE'
  });

  const getRoleLabel = (role: string) => {
    const r = ROLES.find(x => x.value === role);
    return r ? r.label : role;
  };

  const carregarUtilizadores = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listar(0, 100);
      setUtilizadores(data.content);
    } catch (error: any) {
      toast.error('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  const filteredUtilizadores = utilizadores.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.role.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        await usuarioService.alterarRole(editando.id, formData.role);
        toast.success('Role atualizada com sucesso!');
      } else {
        await usuarioService.criar(formData);
        toast.success('Utilizador criado com sucesso!');
      }
      setShowModal(false);
      setEditando(null);
      setFormData({ email: '', senha: '', nome: '', role: 'ESTUDANTE' });
      carregarUtilizadores();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao guardar utilizador');
    }
  };

  const handleAtivar = async (id: string) => {
    try {
      await usuarioService.ativar(id);
      toast.success('Utilizador ativado!');
      carregarUtilizadores();
    } catch (error) {
      toast.error('Erro ao ativar utilizador');
    }
  };

  const handleDesativar = async (id: string) => {
    try {
      await usuarioService.desativar(id);
      toast.success('Utilizador desativado!');
      carregarUtilizadores();
    } catch (error) {
      toast.error('Erro ao desativar utilizador');
    }
  };

  const handleRedefinirSenha = async (id: string) => {
    try {
      const result = await usuarioService.redefinirSenha(id);
      toast.success(result.message);
    } catch (error) {
      toast.error('Erro ao redefinir senha');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este utilizador?')) return;
    try {
      await usuarioService.excluir(id);
      toast.success('Utilizador excluído!');
      carregarUtilizadores();
    } catch (error) {
      toast.error('Erro ao excluir utilizador');
    }
  };

  const openEditModal = (utilizador: Usuario) => {
    setEditando(utilizador);
    setFormData({
      email: utilizador.email,
      senha: '',
      nome: utilizador.nome,
      role: utilizador.role
    });
    setShowModal(true);
  };

  const getRoleBadge = (role: string) => {
    const r = ROLES.find(x => x.value === role);
    return r ? <Badge variant={r.color as any}>{r.label}</Badge> : <Badge>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Utilizadores"
        subtitle="Gerencie utilizadores, roles e permissões do sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestão de Utilizadores' }
        ]}
      />

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar utilizadores..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <Button onClick={() => { setEditando(null); setFormData({ email: '', senha: '', nome: '', role: 'ESTUDANTE' }); setShowModal(true); }}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Utilizador
        </Button>
      </div>

      {/* Lista de utilizadores */}
      <Card>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUtilizadores.map((utilizador) => (
                  <tr key={utilizador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {utilizador.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{utilizador.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {utilizador.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(utilizador.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {utilizador.ativo ? (
                        <span className="inline-flex items-center text-green-600 text-sm">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 text-sm">
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {utilizador.createdAt ? new Date(utilizador.createdAt).toLocaleDateString('pt-AO') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(utilizador)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRedefinirSenha(utilizador.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Redefinir senha"
                        >
                          <KeyIcon className="w-5 h-5" />
                        </button>
                        {utilizador.ativo ? (
                          <button
                            onClick={() => handleDesativar(utilizador.id)}
                            className="text-orange-600 hover:text-orange-900 p-1"
                            title="Desativar"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAtivar(utilizador.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Ativar"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleExcluir(utilizador.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUtilizadores.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum utilizador encontrado
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal de criar/editar utilizador */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editando ? 'Alterar Role' : 'Criar Novo Utilizador'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  disabled={!!editando}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editando}
                />
              </div>
              {!editando && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <Input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
