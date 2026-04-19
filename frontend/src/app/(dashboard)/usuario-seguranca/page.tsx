'use client';

import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export default function UsuarioSegurancaPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'perfil' | 'senha' | 'seguranca' | 'sessoes'>('perfil');
  const [loading, setLoading] = useState(false);
  
  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Estados para sessões
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [loadingSessoes, setLoadingSessoes] = useState(false);

  // Função para alterar senha
  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(senhaAtual, novaSenha);
      
      toast.success('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar sessões (simulação)
  const carregarSessoes = async () => {
    setLoadingSessoes(true);
    try {
      // Simulação de dados - na verdade seria uma chamada à API
      setSessoes([
        {
          id: '1',
          dispositivo: 'Desktop',
          navegador: 'Chrome',
          ip: '192.168.1.100',
          local: 'Luanda, Angola',
          ultimaAtividade: new Date().toISOString(),
          atual: true
        },
        {
          id: '2',
          dispositivo: 'Mobile',
          navegador: 'Safari',
          ip: '192.168.1.101',
          local: 'Luanda, Angola',
          ultimaAtividade: new Date(Date.now() - 86400000).toISOString(),
          atual: false
        }
      ]);
    } finally {
      setLoadingSessoes(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sessoes') {
      carregarSessoes();
    }
  }, [activeTab]);

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuário e Segurança"
        subtitle="Gerencie suas informações de conta e configurações de segurança"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Usuário e Segurança' }
        ]}
      />

      {/* Abas de navegação */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'perfil'
                ? 'border-primary-800 text-primary-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserCircleIcon className="w-5 h-5 inline-block mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('senha')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'senha'
                ? 'border-primary-800 text-primary-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <KeyIcon className="w-5 h-5 inline-block mr-2" />
            Alterar Senha
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'seguranca'
                ? 'border-primary-800 text-primary-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShieldCheckIcon className="w-5 h-5 inline-block mr-2" />
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('sessoes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sessoes'
                ? 'border-primary-800 text-primary-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DevicePhoneMobileIcon className="w-5 h-5 inline-block mr-2" />
            Sessões
          </button>
        </nav>
      </div>

      {/* Conteúdo das abas */}
      <div className="mt-6">
        {/* Aba Perfil */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <Card title="Informações do Perfil" subtitle="Seus dados pessoais">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.nome || 'Usuário'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'email@exemplo.ao'}</p>
                    <Badge variant={user?.role === 'ADMIN' ? 'danger' : 'default'}>
                      {user?.role || 'USUARIO'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <Input
                      value={user?.nome || ''}
                      disabled
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      placeholder="seu@email.ao"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo/Função
                    </label>
                    <Input
                      value={user?.role || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membro desde
                    </label>
                    <Input
                      value={new Date().toLocaleDateString('pt-AO')}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Aba Alterar Senha */}
        {activeTab === 'senha' && (
          <div className="space-y-6">
            <Card 
              title="Alterar Senha" 
              subtitle="Certifique-se de usar uma senha forte e única"
            >
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <Input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {mostrarSenha ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <Input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <Button
                  onClick={handleAlterarSenha}
                  isLoading={loading}
                  className="w-full"
                >
                  <KeyIcon className="w-5 h-5 mr-2" />
                  Alterar Senha
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Aba Segurança */}
        {activeTab === 'seguranca' && (
          <div className="space-y-6">
            <Card title="Configurações de Segurança">
              <div className="space-y-6">
                {/* Autenticação de dois fatores */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Autenticação em Dois Fatores</p>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>

                {/* Notificações de login */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Notificações de Login</p>
                      <p className="text-sm text-gray-500">Receba alertas sobre novas sessões</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativar
                  </Button>
                </div>

                {/* Histórico de senhas */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Histórico de Senhas</p>
                      <p className="text-sm text-gray-500">Não pode reutilizar senhas anteriores</p>
                    </div>
                  </div>
                  <Badge variant="success">Ativo</Badge>
                </div>
              </div>
            </Card>

            {/* Aviso de segurança */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Dicas de Segurança</p>
                  <ul className="text-sm text-amber-700 mt-1 list-disc list-inside">
                    <li>Use senhas diferentes para cada conta</li>
                    <li>Nunca compartilhe sua senha com terceiros</li>
                    <li>Altere sua senha regularmente</li>
                    <li>Faça logout em dispositivos compartilhados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Sessões */}
        {activeTab === 'sessoes' && (
          <div className="space-y-6">
            <Card 
              title="Sessões Ativas" 
              subtitle="Gerencie seus dispositivos conectados"
              action={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={carregarSessoes}
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              }
            >
              {loadingSessoes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessoes.map((sessao) => (
                    <div 
                      key={sessao.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        sessao.atual ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {sessao.dispositivo === 'Mobile' ? (
                          <DevicePhoneMobileIcon className="w-8 h-8 text-gray-400" />
                        ) : (
                          <ComputerDesktopIcon className="w-8 h-8 text-gray-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {sessao.dispositivo} - {sessao.navegador}
                            </p>
                            {sessao.atual && (
                              <Badge variant="success">Atual</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {sessao.ip} • {sessao.local}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Última atividade: {formatarData(sessao.ultimaAtividade)}
                          </p>
                        </div>
                      </div>
                      {!sessao.atual && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Encerrar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Informações sobre sessões</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Você está visualizando suas sessões ativas. Encerrar uma sessão não afeta sua sessão atual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
