'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ScaleIcon, ShieldCheckIcon, DocumentTextIcon,
  UserGroupIcon, BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

interface AuthLayoutProps { children: React.ReactNode; }

const features = [
  { icon: DocumentTextIcon,    titulo: 'Gestão de Processos Judiciais',   descricao: 'Acompanhe o andamento de processos com linha do tempo completa.' },
  { icon: BuildingLibraryIcon, titulo: 'Base Legislativa Actualizada',     descricao: 'Acesso à legislação penal angolana vigente e jurisprudência.' },
  { icon: ShieldCheckIcon,     titulo: 'Segurança e Confidencialidade',    descricao: 'Dados protegidos com encriptação e controlo de acessos por função.' },
  { icon: UserGroupIcon,       titulo: 'Colaboração Institucional',        descricao: 'Plataforma partilhada entre juízes, procuradores e advogados.' },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!isLoading && isAuthenticated && token) router.push('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Toaster position="top-right" />

      {/* ── Painel esquerdo azul — ALARGADO de 480px para 580px ───────── */}
      <div className="hidden lg:flex lg:w-[580px] flex-col bg-[#0f1d35] relative overflow-hidden flex-shrink-0">
        {/* Barra Angola */}
        <div className="h-1 flex flex-shrink-0">
          <div className="flex-1 bg-[#CC092F]" />
          <div className="flex-1 bg-[#111]" />
          <div className="flex-1 bg-[#FFCC00]" />
        </div>

        {/* Padrão geométrico */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20L0 0v40h40V0L20 20z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize:'40px 40px' }} />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <ScaleIcon className="w-7 h-7 text-[#0f1d35]" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-tight">Sistema Penal</p>
                <p className="text-white/40 text-sm leading-tight">República de Angola</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Plataforma Oficial<br />de Gestão Judicial
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Sistema integrado para profissionais do sector judicial angolano.
              Acesso seguro, colaborativo e em conformidade com a legislação vigente.
            </p>
          </div>

          {/* Funcionalidades */}
          <div className="space-y-6 flex-1">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/08 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{f.titulo}</p>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{f.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos</p>
            <p className="text-white/20 text-xs mt-0.5">Todos os direitos reservados · Uso exclusivo institucional</p>
          </div>
        </div>
      </div>

      {/* ── Painel direito — formulário encostado à direita ────────────── */}
      {/* justify-end em vez de justify-center: empurra o card para a direita */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>

        {/* Header mobile */}
        <div className="lg:hidden bg-[#0f1d35] px-5 py-4">
          <div className="h-0.5 flex mb-3">
            <div className="flex-1 bg-[#CC092F]" /><div className="flex-1 bg-[#111]" /><div className="flex-1 bg-[#FFCC00]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <ScaleIcon className="w-5 h-5 text-[#0f1d35]" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Sistema Penal</p>
              <p className="text-white/40 text-xs">República de Angola</p>
            </div>
          </div>
        </div>

        {/* Área do formulário — justify-end para encostar à direita do painel */}
        <div className="flex-1 flex items-center justify-end pr-16 pl-8 py-10">
          <div className="w-full max-w-[400px]">
            <div
              className="rounded-2xl border shadow-[0_4px_32px_rgba(0,0,0,0.1)] overflow-hidden"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              <div className="h-[3px] flex">
                <div className="flex-1 bg-[#CC092F]" /><div className="flex-1 bg-[#111]" /><div className="flex-1 bg-[#FFCC00]" />
              </div>
              <div className="p-8">{children}</div>
            </div>
            <p className="text-center text-xs mt-5" style={{ color:'var(--text-muted)' }}>
              Precisa de ajuda?{' '}
              <a href="mailto:suporte@sistemapenal.gov.ao" className="text-blue-500 hover:underline">
                Contacte o suporte técnico
              </a>
            </p>
          </div>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden text-center py-4 px-6 border-t" style={{ borderColor:'var(--border)', backgroundColor:'var(--bg-surface)' }}>
          <p className="text-xs" style={{ color:'var(--text-muted)' }}>
            © {new Date().getFullYear()} Sistema Penal — Uso exclusivo institucional
          </p>
        </div>
      </div>
    </div>
  );
}
