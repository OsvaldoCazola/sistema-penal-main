'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador', JUIZ: 'Juiz', PROCURADOR: 'Procurador',
  ADVOGADO: 'Advogado', ESTUDANTE: 'Estudante',
};

const lblCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

type Tab = 'perfil' | 'senha';

export default function UsuarioSegurancaPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [loading,   setLoading]   = useState(false);

  const [senhaAtual,     setSenhaAtual]     = useState('');
  const [novaSenha,      setNovaSenha]      = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha,   setMostrarSenha]   = useState(false);

  const passwordStrength = {
    length:    novaSenha.length >= 6,
    uppercase: /[A-Z]/.test(novaSenha),
    number:    /[0-9]/.test(novaSenha),
  };
  const strengthPct = Object.values(passwordStrength).filter(Boolean).length / 3 * 100;
  const strengthColor = strengthPct === 100 ? '#059669' : strengthPct >= 66 ? '#D97706' : '#DC2626';
  const strengthLabel = strengthPct === 100 ? 'Forte' : strengthPct >= 66 ? 'Média' : 'Fraca';

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error('Preencha todos os campos'); return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem'); return;
    }
    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres'); return;
    }
    setLoading(true);
    try {
      await authService.changePassword(senhaAtual, novaSenha);
      toast.success('Senha alterada com sucesso');
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Erro ao alterar senha');
    } finally { setLoading(false); }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'perfil', label: 'Meu Perfil', icon: UserCircleIcon },
    { id: 'senha',  label: 'Alterar Senha', icon: KeyIcon },
  ];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Perfil e Segurança"
        subtitle="Informações da conta e configurações de acesso"
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Perfil e Segurança' },
        ]}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1 w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-[#1a2744] text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Perfil ── */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card de perfil */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#1a2744] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">
                {user?.nome?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">{user?.nome}</p>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            <span className="mt-3 text-xs font-medium px-3 py-1 bg-[#1a2744] text-white rounded-full">
              {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
            </span>

            <div className="mt-5 pt-5 border-t border-gray-100 w-full space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Estado da conta</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircleIcon className="h-3.5 w-3.5" /> Activa
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Permissão</span>
                <span className="text-xs font-medium text-gray-700">
                  {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
              Informações da conta
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lblCls}>Nome completo</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {user?.nome ?? '—'}
                </div>
              </div>
              <div>
                <label className={lblCls}>Email institucional</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {user?.email ?? '—'}
                </div>
              </div>
              <div>
                <label className={lblCls}>Função no sistema</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {ROLE_LABELS[user?.role ?? ''] ?? user?.role ?? '—'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700 leading-relaxed">
                Para alterar o seu nome ou email, contacte o administrador do sistema.
                As informações de perfil são geridas centralmente pela administração.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Alterar Senha ── */}
      {activeTab === 'senha' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
              Alterar Senha de Acesso
            </p>

            <div>
              <label className={lblCls}>Senha actual *</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  className={inputCls + ' pr-10'}
                />
                <button type="button" onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {mostrarSenha ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={lblCls}>Nova senha *</label>
              <input type={mostrarSenha ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className={inputCls} />

              {/* Barra de força */}
              {novaSenha && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${strengthPct}%`, background: strengthColor }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthColor }}>
                    Força da senha: {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className={lblCls}>Confirmar nova senha *</label>
              <input type={mostrarSenha ? 'text' : 'password'} placeholder="Repita a nova senha"
                value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className={inputCls} />
              {confirmarSenha && novaSenha !== confirmarSenha && (
                <p className="text-xs text-red-600 mt-1">As senhas não coincidem</p>
              )}
            </div>

            <button onClick={handleAlterarSenha} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] disabled:opacity-60 transition-colors">
              {loading ? <><Spinner size="sm" /> A guardar...</> : <><KeyIcon className="h-4 w-4" /> Alterar Senha</>}
            </button>
          </div>

          {/* Requisitos */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
              Requisitos de Segurança
            </p>
            <div className="space-y-3">
              {[
                { ok: passwordStrength.length,    label: 'Mínimo de 6 caracteres' },
                { ok: passwordStrength.uppercase, label: 'Pelo menos uma letra maiúscula' },
                { ok: passwordStrength.number,    label: 'Pelo menos um número' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    r.ok ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircleIcon className={`h-3 w-3 ${r.ok ? 'text-emerald-600' : 'text-gray-300'}`} />
                  </div>
                  <span className={`text-xs ${r.ok ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg mt-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                A senha deve ser alterada periodicamente. Nunca partilhe as suas credenciais de acesso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
