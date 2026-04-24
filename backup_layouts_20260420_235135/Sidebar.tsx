'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ScaleIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';

const navigation = [
  // Dashboard e Estatísticas
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR],
    description: 'Estatísticas e overview'
  },
  // Análise de Casos (IA)
  { 
    name: 'Análise de Casos IA', 
    href: '/busca', 
    icon: MagnifyingGlassIcon, 
    roles: [Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE],
    description: 'Busca semântica e análise'
  },
  // Simulador Penal (Novo)
  { 
    name: 'Simulador Penal', 
    href: '/simulador', 
    icon: BeakerIcon, 
    roles: [Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE],
    description: 'Enquadramento com explicabilidade'
  },
  // Verificador de Penas (Novo)
  { 
    name: 'Verificador de Penas', 
    href: '/verificador', 
    icon: ClipboardDocumentCheckIcon, 
    roles: [Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO],
    description: 'Cálculo e verificação de penas'
  },
  // Gestão de Casos
  { 
    name: 'Gestão de Casos', 
    href: '/processos', 
    icon: FolderIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO],
    description: 'Processos judiciais'
  },
  // Jurisprudência
  { 
    name: 'Jurisprudência', 
    href: '/jurisprudencia', 
    icon: DocumentTextIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE],
    description: 'Base de decisões judiciais'
  },
  // Gestão de Leis
  { 
    name: 'Gestão de Leis', 
    href: '/legislacao', 
    icon: BookOpenIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE],
    description: 'Leis e artigos'
  },
  // Gestão de Utilizadores (apenas Admin)
  { 
    name: 'Gestão de Utilizadores', 
    href: '/admin/utilizadores', 
    icon: UsersIcon, 
    roles: [Role.ADMIN],
    description: 'Gerir utilizadores do sistema'
  },
  // Chat IA (Assistente Jurídico)
  { 
    name: 'Assistente IA', 
    href: '/chat', 
    icon: ChatBubbleLeftRightIcon, 
    roles: [Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO],
    description: 'Chat com assistente jurídico IA'
  },
  // Usuários e Segurança (perfil do utilizador)
  { 
    name: 'Perfil e Segurança', 
    href: '/usuario-seguranca', 
    icon: ShieldCheckIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE],
    description: 'Configurações da minha conta'
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Filtrar menus por role
  const filteredNavigation = navigation.filter((item) => {
    if (!user) return false;
    const userRole = user.role;
    // ADMIN vê tudo
    if (userRole === 'ADMIN') return true;
    // Outros roles: verificar se está na lista
    return item.roles.includes(userRole as Role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-[200px] z-50 transition-all duration-300',
        'bg-transparent',
        isCollapsed ? 'w-16' : 'w-72'
      )}
      style={{ height: 'calc(100vh - 200px)' }}
    >
      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto pt-8 pb-2 px-0 scrollbar-thin">
        <ul className={cn('grid gap-1 px-2', isCollapsed ? 'grid-cols-1' : 'grid-cols-2')}>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-0 py-2 rounded-xl text-xs font-medium transition-all duration-200 ease-out',
                    isActive
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg border-transparent'
                      : 'text-[#7A7A7A] hover:border-transparent hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn('h-12 w-6 flex-shrink-0 transition-transform duration-200', isActive ? 'text-white' : 'text-gray-500', isActive && 'scale-110')} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-center">
                      <span className="block truncate text-[10px]">{item.name}</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
