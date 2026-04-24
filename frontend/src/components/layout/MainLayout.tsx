'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ScaleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/store/auth.store';

/* ── Spinner de carregamento ────────────────────────────────────────────── */

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-14 h-14 rounded-xl bg-primary-800 flex items-center justify-center mb-5">
        <ScaleIcon className="h-7 w-7 text-white" />
      </div>
      {/* Barra de progresso animada */}
      <div className="w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-700 rounded-full animate-[loading_1.4s_ease-in-out_infinite]"
          style={{
            animation: 'loading 1.4s ease-in-out infinite',
          }}
        />
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
        A carregar o sistema…
      </p>
      <style>{`
        @keyframes loading {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

/* ── MainLayout ─────────────────────────────────────────────────────────── */

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  /* Estado de colapso da sidebar (desktop) e abertura mobile */
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Restaurar preferência de colapso */
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === 'true') setCollapsed(true);
  }, []);

  /* Guardar preferência de colapso */
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  /* Toggle combinado: desktop colapsa, mobile abre */
  const handleToggleSidebar = useCallback(() => {
    if (window.innerWidth >= 768) {
      setCollapsed(c => !c);
    } else {
      setMobileOpen(o => !o);
    }
  }, []);

  const handleCloseMobile = useCallback(() => setMobileOpen(false), []);

  /* Verificar autenticação */
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router, setLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      {/* Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />

      {/* Header fixo — 64px */}
      <Header onToggleSidebar={handleToggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* Conteúdo principal */}
      <main className={cn(
        'transition-all duration-300 ease-in-out',
        /* Empurrar para baixo do header */
        'pt-16',
        /* Empurrar para a direita da sidebar (apenas desktop) */
        'md:pl-56',
        collapsed && 'md:pl-[60px]',
      )}>
        <div className="min-h-[calc(100vh-64px)] p-6">
          {children}
        </div>

        {/* Rodapé */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
          {/* Barra tricolor Angola */}
          <div className="h-[3px] flex">
            <div className="flex-1 bg-[#CC092F]" />
            <div className="flex-1 bg-[#111111]" />
            <div className="flex-1 bg-[#FFCC00]" />
          </div>
          <div className="px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              © {new Date().getFullYear()} Sistema Penal · República de Angola
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-medium hidden sm:block">
              Ministério da Justiça e dos Direitos Humanos
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
