'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/store/auth.store';
import { Spinner } from '@/components/ui/Spinner';
import { ScaleIcon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded flex items-center justify-center mb-6 border border-white/20">
          <ScaleIcon className="h-8 w-8 text-white" />
        </div>
        <Spinner size="lg" className="text-primary-400" />
        <p className="mt-4 text-primary-400 text-sm font-medium">A carregar o sistema...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '4px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <Sidebar />
      <Header />
      <main className="fixed top-0 left-56 right-0 bottom-0 z-30 overflow-hidden transition-all duration-300 ml-16 mr-0">
        <div className="absolute inset-x-0 top-[150px] bottom-0 overflow-y-auto scrollbar-thin">
          <div className="pt-[50px] min-h-[calc(100vh-190px)] bg-transparent p-6">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 relative overflow-hidden">
        {/* Gradiente institucional */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900"></div>
        {/* Barra decorativa */}
        <div className="flex h-1 relative z-10">
          <div className="flex-1 bg-primary-800"></div>
          <div className="flex-1 bg-primary-600"></div>
          <div className="flex-1 bg-primary-800"></div>
        </div>
        <div className="py-4 px-6 relative z-10">
          <div className="flex items-center justify-between text-xs text-white/80">
            <p>© {new Date().getFullYear()} Sistema Penal - República de Angola</p>
            <p className="font-medium">Ministério da Justiça e dos Direitos Humanos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
