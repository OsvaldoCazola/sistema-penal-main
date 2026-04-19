'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScaleIcon, ShieldCheckIcon, DocumentTextIcon, UserGroupIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  {
    icon: DocumentTextIcon,
    titulo: 'Gestão de Processos Judiciais',
    descricao: 'Acompanhe o andamento de processos com linha do tempo completa.',
  },
  {
    icon: BuildingLibraryIcon,
    titulo: 'Base Legislativa Actualizada',
    descricao: 'Acesso à legislação penal angolana vigente e jurisprudência.',
  },
  {
    icon: ShieldCheckIcon,
    titulo: 'Segurança e Confidencialidade',
    descricao: 'Dados protegidos com encriptação e controlo de acessos por função.',
  },
  {
    icon: UserGroupIcon,
    titulo: 'Colaboração Institucional',
    descricao: 'Plataforma partilhada entre juízes, procuradores e advogados.',
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!isLoading && isAuthenticated && token) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />

      {/* ── Painel esquerdo institucional ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between bg-[#1a2744] relative overflow-hidden flex-shrink-0">
        {/* Barra Angola no topo */}
        <div className="h-1 flex flex-shrink-0">
          <div className="flex-1 bg-[#CC092F]" />
          <div className="flex-1 bg-[#111]" />
          <div className="flex-1 bg-[#FFCC00]" />
        </div>

        {/* Padrão geométrico sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20L0 0v40h40V0L20 20z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo e título */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <ScaleIcon className="w-6 h-6 text-[#1a2744]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Sistema Penal</p>
                <p className="text-white/40 text-xs leading-tight">República de Angola</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Plataforma Oficial<br />de Gestão Judicial
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Sistema integrado para profissionais do sector judicial angolano.
              Acesso seguro, colaborativo e em conformidade com a legislação vigente.
            </p>
          </div>

          {/* Funcionalidades */}
          <div className="space-y-5 flex-1">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white/08 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-white/70" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{f.titulo}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{f.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos
            </p>
            <p className="text-white/20 text-xs mt-0.5">
              Todos os direitos reservados · Uso exclusivo institucional
            </p>
          </div>
        </div>
      </div>

      {/* ── Painel direito — formulário ────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#f5f6fa]">
        {/* Header mobile */}
        <div className="lg:hidden bg-[#1a2744] px-5 py-4">
          <div className="h-0.5 flex mb-3">
            <div className="flex-1 bg-[#CC092F]" />
            <div className="flex-1 bg-[#111]" />
            <div className="flex-1 bg-[#FFCC00]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <ScaleIcon className="w-5 h-5 text-[#1a2744]" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Sistema Penal</p>
              <p className="text-white/40 text-xs">República de Angola</p>
            </div>
          </div>
        </div>

        {/* Conteúdo centrado */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[420px]">
            {/* Card do formulário */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="h-[3px] flex">
                <div className="flex-1 bg-[#CC092F]" />
                <div className="flex-1 bg-[#111]" />
                <div className="flex-1 bg-[#FFCC00]" />
              </div>
              <div className="p-8">
                {children}
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Precisa de ajuda?{' '}
              <a href="mailto:suporte@sistemapenal.gov.ao" className="text-blue-600 hover:underline">
                Contacte o suporte técnico
              </a>
            </p>
          </div>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden text-center py-4 px-6 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sistema Penal — Uso exclusivo institucional
          </p>
        </div>
      </div>
    </div>
  );
}
