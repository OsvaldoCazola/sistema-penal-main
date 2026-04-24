'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  ScaleIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

/* ── Utilitário de tema ─────────────────────────────────────────────────── */

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { dark, toggle };
}

/* ── Labels de role ─────────────────────────────────────────────────────── */

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  JUIZ: 'Juiz',
  PROCURADOR: 'Procurador',
  ADVOGADO: 'Advogado',
  ESTUDANTE: 'Estudante',
};

/* ── Header ─────────────────────────────────────────────────────────────── */

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { dark, toggle: toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  /* Fechar dropdown ao clicar fora */
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  /* Pesquisa: navegar para /busca com o termo */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  /* Logout limpo */
  async function handleLogout() {
    setProfileOpen(false);
    try {
      const rt = localStorage.getItem('refreshToken');
      if (rt) await api.post('/auth/logout', { refreshToken: rt }).catch(() => null);
    } finally {
      clearAuth();
      router.push('/login');
    }
  }

  const initials = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U';
  const shortName = user?.nome?.split(' ').slice(0, 2).join(' ') ?? 'Utilizador';
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 h-16',
      'flex items-center px-4 gap-3',
      'border-b transition-colors duration-200',
      'bg-white border-gray-200',
      'dark:bg-gray-900 dark:border-gray-800',
    )}>

      {/* ── Esquerda: hamburger + logo ── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800',
          )}
          aria-label="Alternar menu lateral"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105',
            'bg-primary-800 dark:bg-primary-700',
          )}>
            <ScaleIcon className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">
              Sistema Penal
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">
              República de Angola
            </p>
          </div>
        </Link>
      </div>

      {/* ── Centro: pesquisa ── */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar processos, leis, jurisprudência…"
            className={cn(
              'w-full pl-9 pr-4 py-2 text-sm rounded-lg border transition-colors',
              'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 focus:bg-white',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500',
              'dark:focus:bg-gray-800/80 dark:focus:border-primary-500',
            )}
          />
        </div>
      </form>

      {/* ── Direita: acções + avatar ── */}
      <div className="flex items-center gap-0.5 flex-shrink-0 ml-auto">

        {/* Toggle tema */}
        <button
          onClick={toggleTheme}
          title={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800',
          )}
        >
          {dark
            ? <SunIcon className="h-[18px] w-[18px]" />
            : <MoonIcon className="h-[18px] w-[18px]" />}
        </button>

        {/* Ajuda */}
        <Link
          href="/ajuda"
          title="Centro de ajuda"
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800',
          )}
        >
          <QuestionMarkCircleIcon className="h-[18px] w-[18px]" />
        </Link>

        {/* Notificações */}
        <button
          title="Notificações"
          className={cn(
            'relative p-2 rounded-lg transition-colors',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800',
          )}
        >
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* Perfil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            className={cn(
              'flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg transition-colors',
              profileOpen
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary-800 dark:bg-primary-700 flex items-center justify-center text-[11px] font-bold text-white">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-[2px] ring-white dark:ring-gray-900" />
            </div>

            {/* Nome + role */}
            <div className="hidden md:block text-left leading-none">
              <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100 leading-tight">{shortName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{roleLabel}</p>
            </div>

            <ChevronDownIcon className={cn(
              'h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ml-0.5',
              profileOpen && 'rotate-180',
            )} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className={cn(
              'absolute right-0 top-full mt-2 w-60 z-50',
              'rounded-xl border shadow-xl overflow-hidden',
              'bg-white border-gray-200',
              'dark:bg-gray-900 dark:border-gray-700',
            )}>
              {/* Info do utilizador */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary-800 dark:bg-primary-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.nome}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="py-1">
                <Link
                  href="/usuario-seguranca"
                  onClick={() => setProfileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors',
                    'text-gray-700 hover:bg-gray-50',
                    'dark:text-gray-300 dark:hover:bg-gray-800',
                  )}
                >
                  <UserCircleIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Perfil e segurança</span>
                </Link>

                <div className="my-1 mx-3 border-t border-gray-100 dark:border-gray-800" />

                <button
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors',
                    'text-red-600 hover:bg-red-50',
                    'dark:text-red-400 dark:hover:bg-red-900/20',
                  )}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Terminar sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra tricolor Angola no fundo do header */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] flex pointer-events-none">
        <div className="flex-1 bg-[#CC092F]" />
        <div className="flex-1 bg-[#111111]" />
        <div className="flex-1 bg-[#FFCC00]" />
      </div>
    </header>
  );
}
