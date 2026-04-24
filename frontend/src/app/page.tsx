'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ScaleIcon, DocumentTextIcon, MapIcon, ChartBarIcon,
  ShieldCheckIcon, AcademicCapIcon, BellAlertIcon,
  ChatBubbleLeftRightIcon, ArrowRightIcon, CheckCircleIcon,
  ClockIcon, UserGroupIcon, BuildingLibraryIcon, SunIcon, MoonIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth.store';
import { noticiaService, Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';

/* ── Hook de tema (igual ao Header) ─────────────────────────────────────── */
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };
  return { dark, toggle };
}

/* ── Dados ────────────────────────────────────────────────────────────────── */
const modulos = [
  { icon: DocumentTextIcon,       titulo: 'Gestão de Processos',    descricao: 'Acompanhe processos judiciais com linha do tempo visual, desde a denúncia até o trânsito em julgado.' },
  { icon: ScaleIcon,              titulo: 'Simulador de Penas',      descricao: 'Calcule estimativas de pena considerando agravantes, atenuantes e circunstâncias do caso.' },
  { icon: ChartBarIcon,           titulo: 'Indicadores Judiciais',   descricao: 'Relatórios automáticos com tempo médio de julgamento, taxa de reincidência e mais.' },
  { icon: BuildingLibraryIcon,    titulo: 'Base Legislativa',         descricao: 'Consulte leis, decretos e artigos com comparador de versões para alterações legislativas.' },
  // ── Linha de baixo: centralizada em relação às laterais ──
  { icon: AcademicCapIcon,        titulo: 'Modo de Estudo',          descricao: 'Estudantes podem simular julgamentos e praticar aplicação das leis em casos reais.' },
  { icon: ChatBubbleLeftRightIcon,titulo: 'Assistente Jurídico',     descricao: 'Tire dúvidas sobre legislação penal angolana com assistente inteligente.' },
  { icon: ShieldCheckIcon,        titulo: 'Transparência IA',         descricao: 'Todas as sugestões do sistema incluem explicação clara do raciocínio utilizado.' },
];

const estatisticas = [
  { numero: '18',   label: 'Províncias Cobertas', icon: MapIcon },
  { numero: '100+', label: 'Leis Registadas',      icon: DocumentTextIcon },
  { numero: '24/7', label: 'Disponibilidade',      icon: ClockIcon },
  { numero: '100%', label: 'Seguro e Privado',     icon: ShieldCheckIcon },
];

/* ── FALLBACK de atualizações ────────────────────────────────────────────── */
const FALLBACK_ATUALIZACOES: Atualizacao[] = [
  {
    id: '1', tipo: 'NOVA_LEI',
    titulo: 'Nova Legislação Penal',
    descricao: 'Em breve novas atualizações legislativas sobre o Código Penal Angolano.',
    dataPublicacao: new Date().toISOString(),
    tipoLabel: 'Nova Lei', tipoIcon: 'document', link: '/legislacao',
  },
  {
    id: '2', tipo: 'NOVA_JURISPRUDENCIA',
    titulo: 'Jurisprudência Actualizada',
    descricao: 'Acompanhe as últimas decisões judiciais do Tribunal Supremo.',
    dataPublicacao: new Date().toISOString(),
    tipoLabel: 'Jurisprudência', tipoIcon: 'scale', link: '/jurisprudencia',
  },
  {
    id: '3', tipo: 'ALTERACAO_ARTIGO',
    titulo: 'Alterações Legislativas',
    descricao: 'Fique por dentro das mudanças na legislação angolana vigente.',
    dataPublicacao: new Date().toISOString(),
    tipoLabel: 'Alteração', tipoIcon: 'pencil', link: '/legislacao/artigos',
  },
];

/* ════════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [scrolled, setScrolled]             = useState(false);
  const [atualizacoes, setAtualizacoes]     = useState<Atualizacao[]>([]);
  const [loadingNews, setLoadingNews]       = useState(true);
  const router  = useRouter();
  const { clearAuth, isAuthenticated }      = useAuthStore();
  const { dark, toggle: toggleTheme }       = useTheme();

  /* Scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Atualizações */
  useEffect(() => {
    (async () => {
      try {
        const result = await noticiaService.listarAtualizacoes(0, 3);
        setAtualizacoes(result.content?.length ? result.content : FALLBACK_ATUALIZACOES);
      } catch {
        setAtualizacoes(FALLBACK_ATUALIZACOES);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);

  const goToLogin    = () => { clearAuth(); localStorage.setItem('returnUrl', '/jurisprudencia'); router.push('/login'); };
  const goToRegister = () => { clearAuth(); router.push('/register'); };

  /* ── Header scroll classes ─────────────────────────────────────────────── */
  const headerBg  = scrolled ? 'bg-white dark:bg-[#0f1d35] shadow-md py-2' : 'bg-transparent py-4';
  const navText   = scrolled ? 'text-gray-600 hover:text-primary-700 dark:text-gray-300 dark:hover:text-white' : 'text-primary-200 hover:text-white';
  const logoTitle = scrolled ? 'text-gray-900 dark:text-white' : 'text-white';
  const logoSub   = scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-primary-300';
  const loginBtn  = scrolled ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10' : 'text-white hover:bg-white/10';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* ════ HEADER ═══════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-600 rounded flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${logoTitle}`}>Sistema Penal</h1>
                <p className={`text-xs ${logoSub}`}>República de Angola</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[['#modulos','Funcionalidades'],['#noticias','Notícias'],['#sobre','Sobre']].map(([href, label]) => (
                <a key={href} href={href} className={`text-sm font-medium transition-colors ${navText}`}>{label}</a>
              ))}
            </nav>

            {/* Acções */}
            <div className="flex items-center gap-2">
              {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                title={dark ? 'Modo claro' : 'Modo escuro'}
                className={`p-2 rounded-lg transition-colors ${loginBtn}`}
              >
                {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button onClick={goToLogin} className={`px-4 py-2 text-sm font-medium rounded transition-colors ${loginBtn}`}>
                Entrar
              </button>
              <button onClick={goToRegister} className="px-5 py-2 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white text-sm font-medium rounded shadow-sm transition-colors">
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ════ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/tribunais/Tribunal-Supremo-novo.png" alt="Tribunal Supremo de Angola" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/85 to-primary-700/80" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
            <BellAlertIcon className="w-4 h-4" />
            <span>Sistema oficial do Ministério da Justiça</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Gestão Judicial<br /><span className="text-primary-400">para Angola</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Plataforma integrada para gestão de processos penais, consulta de legislação e análise de dados judiciais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button onClick={goToRegister} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white font-semibold rounded hover:shadow-xl transition-all hover:scale-105">
              Começar Agora <ArrowRightIcon className="w-5 h-5" />
            </button>
            <a href="#modulos" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-primary-400 text-white font-medium rounded hover:bg-primary-400/20 transition-colors">
              Conhecer Funcionalidades
            </a>
          </div>
          <div className="flex items-center gap-6 text-gray-300">
            {['Gratuito para órgãos públicos','Dados seguros'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-primary-400" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ESTATÍSTICAS ══════════════════════════════════════════════════ */}
      <section className="py-10 border-b" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estatisticas.map((s, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded mb-3" style={{ backgroundColor: 'rgba(26,39,68,0.1)' }}>
                  <s.icon className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                </div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.numero}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FUNCIONALIDADES ════════════════════════════════════════════════
          Layout: 4 na linha de cima + 3 na linha de baixo centrados
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="modulos" className="py-20" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Funcionalidades do Sistema
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Ferramentas desenvolvidas para facilitar o trabalho de profissionais do Direito,
              com interface profissional e adaptada ao contexto jurídico angolano.
            </p>
          </div>

          {/* Linha 1: 4 módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {modulos.slice(0, 4).map((m, i) => (
              <ModuloCard key={i} modulo={m} />
            ))}
          </div>

          {/* Linha 2: 3 módulos centrados — offset de 1 coluna de cada lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Célula vazia à esquerda — só visível em lg */}
            <div className="hidden lg:block" />
            {modulos.slice(4).map((m, i) => (
              <ModuloCard key={i + 4} modulo={m} />
            ))}
            {/* Célula vazia à direita — só visível em lg */}
            <div className="hidden lg:block" />
          </div>

          <div className="text-center mt-12">
            <button onClick={goToRegister} className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded shadow-sm transition-colors" style={{ backgroundColor: '#1a2744' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#243561')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a2744')}>
              Aceder ao Sistema <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ════ ACTUALIZAÇÕES LEGISLATIVAS E JURISPRUDENCIAIS ════════════════ */}
      <section id="noticias" className="py-20" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Actualizações Legislativas e Jurisprudenciais
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Mantenha-se informado sobre novas leis, alterações de artigos e jurisprudência relevante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loadingNews ? (
              <div className="col-span-3 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800" />
              </div>
            ) : atualizacoes.length > 0 ? (
              atualizacoes.map(a => <AtualizacaoCard key={a.id} atualizacao={a} />)
            ) : (
              <div className="col-span-3 text-center py-8" style={{ color: 'var(--text-muted)' }}>
                Nenhuma actualização disponível.
              </div>
            )}
          </div>

          {atualizacoes.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => { localStorage.setItem('returnUrl', '/jurisprudencia'); router.push('/login'); }}
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded transition-colors"
                style={{ backgroundColor: '#1a2744' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#243561')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a2744')}
              >
                Ver todas as actualizações <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════ COBERTURA NACIONAL ════════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium mb-6"
                style={{ backgroundColor: 'rgba(26,39,68,0.1)', color: 'var(--text-primary)' }}>
                <MapIcon className="w-4 h-4" />
                <span>Cobertura Nacional</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Presente em Todas as 18 Províncias de Angola
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                O Sistema Penal abrange todo o território nacional, permitindo gestão unificada de processos judiciais desde Cabinda ao Cunene.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { provincia: 'Luanda',   processos: '45%', icon: '🏛️' },
                  { provincia: 'Benguela', processos: '12%', icon: '⚖️' },
                  { provincia: 'Huambo',   processos: '8%',  icon: '📋' },
                  { provincia: 'Huíla',    processos: '7%',  icon: '🔍' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded p-3 transition-colors" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.provincia}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.processos} dos processos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SOBRE / PARA QUEM É ═══════════════════════════════════════════ */}
      <section id="sobre" className="py-20" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Desenvolvido para Profissionais do Direito em Angola
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                O Sistema Penal foi concebido com foco na eficiência e profissionalismo.
              </p>
              <div className="space-y-3">
                {[
                  { icon: UserGroupIcon,      text: 'Magistrados e Juízes — Gestão completa de processos e decisões' },
                  { icon: BuildingLibraryIcon, text: 'Procuradores — Acompanhamento de denúncias e acusações' },
                  { icon: ScaleIcon,           text: 'Advogados — Consulta de jurisprudência e legislação' },
                  { icon: AcademicCapIcon,     text: 'Estudantes — Modo de estudo com casos práticos' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(26,39,68,0.1)' }}>
                      <item.icon className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <p className="pt-1" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de registo */}
            <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="rounded p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Pronto para começar?</h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Crie a sua conta gratuitamente e tenha acesso a todas as funcionalidades do sistema.
                </p>
                <button onClick={goToRegister} className="block w-full py-3 text-white text-center font-semibold rounded transition-colors"
                  style={{ backgroundColor: '#1a2744' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#243561')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a2744')}>
                  Criar Conta Gratuita
                </button>
                <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                  Já tem conta?{' '}
                  <button onClick={goToLogin} className="text-blue-500 hover:underline font-medium">Faça login</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-[3px] flex rounded-full overflow-hidden mb-8">
            <div className="flex-1 bg-[#CC092F]" />
            <div className="flex-1 bg-[#111]" />
            <div className="flex-1 bg-[#FFCC00]" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Sistema Penal</p>
                <p className="text-white/70 text-sm">República de Angola</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/80 text-sm">© {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos</p>
              <p className="text-white/60 text-xs mt-1">Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Componente auxiliar para card de módulo ──────────────────────────────── */
function ModuloCard({ modulo }: { modulo: { icon: React.ElementType; titulo: string; descricao: string } }) {
  return (
    <div className="group p-5 rounded border transition-all duration-200 hover:shadow-md"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <div className="w-10 h-10 rounded flex items-center justify-center mb-3 transition-colors"
        style={{ backgroundColor: 'rgba(26,39,68,0.08)' }}>
        <modulo.icon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{modulo.titulo}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{modulo.descricao}</p>
    </div>
  );
}
