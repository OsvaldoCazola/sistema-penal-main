'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';

/* ── Itens de navegação ─────────────────────────────────────────────────── */

interface NavItem {
  name: string;
  shortName: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    shortName: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: [Role.ADMIN, Role.ESTUDANTE],
  },
  {
    name: 'Casos Práticos',
    shortName: 'Casos',
    href: '/casos-praticos',
    icon: MagnifyingGlassIcon,
    roles: [Role.ESTUDANTE],
  },
  {
    name: 'Meu Progresso',
    shortName: 'Progresso',
    href: '/dashboard/estudante',
    icon: ClipboardDocumentCheckIcon,
    roles: [Role.ESTUDANTE],
  },
  {
    name: 'Legislação',
    shortName: 'Legislação',
    href: '/legislacao',
    icon: BookOpenIcon,
    roles: [Role.ADMIN, Role.ESTUDANTE],
  },
  {
    name: 'Utilizadores',
    shortName: 'Utilizadores',
    href: '/admin/utilizadores',
    icon: UsersIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Perfil e Segurança',
    shortName: 'Perfil',
    href: '/usuario-seguranca',
    icon: ShieldCheckIcon,
    roles: [Role.ADMIN, Role.ESTUDANTE],
  },
];

/* ── Sidebar ─────────────────────────────────────────────────────────────── */

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  /* Fechar sidebar mobile ao mudar de rota */
  useEffect(() => {
    onCloseMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* Fechar overlay ao pressionar ESC */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseMobile();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCloseMobile]);

  const userRole = (user?.role as Role) ?? undefined;
  const visibleItems = userRole
    ? NAV_ITEMS.filter(item => item.roles.includes(userRole))
    : [];

  const sidebarContent = (
    <nav className="flex flex-col h-full py-3 overflow-y-auto">
      <ul className="flex flex-col gap-0.5 px-2">
        {visibleItems.map(item => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-150 group relative',
                  isActive
                    ? [
                        'bg-primary-800 text-white',
                        'dark:bg-primary-700',
                      ]
                    : [
                        'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                      ],
                  collapsed && 'justify-center px-2',
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 flex-shrink-0 transition-transform duration-150',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300',
                  isActive && 'scale-105',
                )} />

                {!collapsed && (
                  <span className="truncate leading-tight">
                    {item.shortName}
                  </span>
                )}

                {/* Tooltip quando colapsada */}
                {collapsed && (
                  <div className={cn(
                    'absolute left-full ml-2 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap pointer-events-none',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-100',
                    'bg-gray-900 text-white dark:bg-gray-700',
                    'shadow-lg z-50',
                  )}>
                    {item.name}
                    {/* Seta */}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ── Overlay mobile ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar desktop (fixa) ── */}
      <aside className={cn(
        'fixed top-16 left-0 bottom-0 z-30',
        'hidden md:flex flex-col',
        'border-r transition-all duration-300 ease-in-out',
        'bg-white border-gray-200',
        'dark:bg-gray-900 dark:border-gray-800',
        collapsed ? 'w-[60px]' : 'w-56',
      )}>
        {sidebarContent}
      </aside>

      {/* ── Sidebar mobile (drawer) ── */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 z-40 w-64',
        'flex flex-col md:hidden',
        'border-r transition-transform duration-300 ease-in-out',
        'bg-white border-gray-200',
        'dark:bg-gray-900 dark:border-gray-800',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {/* Cabeçalho do drawer mobile */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Navegação</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
