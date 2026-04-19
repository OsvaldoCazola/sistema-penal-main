'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

function AngolaAccent() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
      <div className="flex-1 bg-primary-800" />
      <div className="flex-1 bg-primary-700" />
      <div className="flex-1 bg-primary-600" />
    </div>
  );
}

function AngolaEmblem() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="w-0.5 h-3 bg-gray-800 rounded-full" />
      <div className="w-0.5 h-3 bg-gray-600 rounded-full" />
      <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
    </div>
  );
}

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-[190px] bg-gray-100 border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Lado esquerdo - Data e Saudação */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              <span className="text-sm font-bold">{user?.nome?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.nome || 'Nome do utilizador'}</p>
              <p className="text-xs text-gray-500">Sessão ativa</p>
            </div>
          </div>
        </div>

        {/* Centro - Busca Profissional */}
        <div className="flex-1 max-w-2xl mx-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar processos, leis, jurisprudência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-12 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-1">
          {/* Hora */}
          <div className="hidden md:flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-sm mr-2 border border-gray-300">
            {formatTime(currentTime)}
          </div>

          {/* Ajuda */}
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-sm transition-all duration-150"
            aria-label="Ajuda"
            title="Centro de Ajuda"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>

          {/* Separador */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Profile button clicked, isProfileOpen:', !isProfileOpen);
                setIsProfileOpen(!isProfileOpen);
              }}
              className={cn(
                'flex items-center gap-2 py-1.5 px-2 rounded-sm transition-all duration-150 cursor-pointer',
                isProfileOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
              )}
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-sm bg-gradient-to-br from-primary-700 to-primary-600 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {user?.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-600 rounded-full ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {user?.nome.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight">
                  {user?.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
              <ChevronDownIcon className={cn(
                'h-3.5 w-3.5 text-gray-500 transition-transform duration-200',
                isProfileOpen && 'rotate-180'
              )} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl border border-gray-100 overflow-hidden z-50 ring-1 ring-gray-900/5">
                <div className="relative px-4 py-3 bg-gradient-to-r from-primary-900 to-primary-800">
                  <div className="absolute top-0 left-0 right-0 h-0.5 flex">
                    <div className="flex-1 bg-primary-800" />
                    <div className="flex-1 bg-primary-700" />
                    <div className="flex-1 bg-primary-600" />
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{user?.nome}</p>
                  <p className="text-xs text-primary-200 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsProfileOpen(false);
                      
                      // Fazer logout manualmente sem depender da função do hook
                      try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                          try {
                            await api.post('/auth/logout', { refresh_token: refreshToken });
                          } catch (e) {
                            // Ignorar erro da API
                          }
                        }
                      } catch (err) {
                        // Ignorar erros
                      }
                      
                      // Limpar localStorage
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('refreshToken');
                      
                      // Limpar Zustand store
                      clearAuth();
                      
                      // Redirecionar
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Terminar Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
