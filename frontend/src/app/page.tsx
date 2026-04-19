'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ScaleIcon,
  DocumentTextIcon,
  MapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { JusticeIllustration, AngolaMap } from '@/components/illustrations';
import { useAuthStore } from '@/store/auth.store';
import { noticiaService, Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';

const modulos = [
  {
    icon: DocumentTextIcon,
    titulo: 'Gestão de Processos',
    descricao: 'Acompanhe processos judiciais com linha do tempo visual, desde a denúncia até o trânsito em julgado.',
  },
  {
    icon: ScaleIcon,
    titulo: 'Simulador de Penas',
    descricao: 'Calcule estimativas de pena considerando agravantes, atenuantes e circunstâncias do caso.',
  },
  {
    icon: ChartBarIcon,
    titulo: 'Indicadores Judiciais',
    descricao: 'Relatórios automáticos com tempo médio de julgamento, taxa de reincidência e mais.',
  },
  {
    icon: BuildingLibraryIcon,
    titulo: 'Base Legislativa',
    descricao: 'Consulte leis, decretos e artigos com comparador de versões para alterações legislativas.',
  },
  {
    icon: AcademicCapIcon,
    titulo: 'Modo de Estudo',
    descricao: 'Estudantes podem simular julgamentos e praticar aplicação das leis em casos reais.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    titulo: 'Assistente Jurídico',
    descricao: 'Tire dúvidas sobre legislação penal angolana com assistente inteligente.',
  },
  {
    icon: ShieldCheckIcon,
    titulo: 'Transparência IA',
    descricao: 'Todas as sugestões do sistema incluem explicação clara do raciocínio utilizado.',
  },
];

const estatisticas = [
  { numero: '18', label: 'Províncias Cobertas', icon: MapIcon },
  { numero: '100+', label: 'Leis Registadas', icon: DocumentTextIcon },
  { numero: '24/7', label: 'Disponibilidade', icon: ClockIcon },
  { numero: '100%', label: 'Seguro e Privado', icon: ShieldCheckIcon },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { clearAuth, isAuthenticated, accessToken } = useAuthStore();
  
  // Verificar token - só no cliente
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('accessToken');
    setHasToken(!!token);
    
    if (!token && isAuthenticated) {
      clearAuth();
    }
  }, [isAuthenticated, clearAuth]);
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>([]);
  const [loadingAtualizacoes, setLoadingAtualizacoes] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const isLoggedIn = isAuthenticated && !!token;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carregarAtualizacoes = async () => {
      try {
        const result = await noticiaService.listarAtualizacoes(0, 3);
        // Verificar se há dados reais ou usar fallback
        if (result.content && result.content.length > 0) {
          setAtualizacoes(result.content);
        } else {
          // Fallback: usar dados de exemplo quando não há dados no backend
          setAtualizacoes([
            {
              id: '1',
              tipo: 'NOVA_LEI' as const,
              titulo: 'Nova Legislação Penal',
              descricao: 'Em breve novas atualizações legislativas',
              dataPublicacao: new Date().toISOString(),
              tipoLabel: 'Nova Lei',
              tipoIcon: 'document',
              link: '/legislacao'
            },
            {
              id: '2',
              tipo: 'NOVA_JURISPRUDENCIA' as const,
              titulo: 'Jurisprudência Atualizada',
              descricao: 'Acompanhe as últimas decisões judiciais',
              dataPublicacao: new Date().toISOString(),
              tipoLabel: 'Jurisprudência',
              tipoIcon: 'scale',
              link: '/jurisprudencia'
            },
            {
              id: '3',
              tipo: 'ALTERACAO_ARTIGO' as const,
              titulo: 'Alterações Legislativas',
              descricao: 'Fique por dentro das mudanças na legislação',
              dataPublicacao: new Date().toISOString(),
              tipoLabel: 'Alteração',
              tipoIcon: 'pencil',
              link: '/legislacao/artigos'
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
        // Em caso de erro, mantém array vazio
        setAtualizacoes([]);
      } finally {
        setLoadingAtualizacoes(false);
      }
    };
    carregarAtualizacoes();
  }, []);

  // Função para ir para login, limpando qualquer sessão anterior
  const goToLogin = () => {
    clearAuth();
    // Salvar a URL atual para redirecionar após login
    const returnUrl = '/jurisprudencia';
    localStorage.setItem('returnUrl', returnUrl);
    router.push('/login');
  };

  // Função para ir para registo
  const goToRegister = () => {
    clearAuth();
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navegação */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-600 rounded flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                  Sistema Penal
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-primary-400'}`}>
                  República de Angola
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#modulos"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-700' : 'text-primary-400 hover:text-white'
                }`}
              >
                Funcionalidades
              </a>
              <a
                href="#noticias"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-700' : 'text-primary-400 hover:text-white'
                }`}
              >
                Notícias
              </a>
              <a
                href="#sobre"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-700' : 'text-primary-400 hover:text-white'
                }`}
              >
                Sobre
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {/* Botão Ir para Dashboard removido - usuário será redirecionado automaticamente se estiver logado */}
              <>
                <button
                  onClick={goToLogin}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    scrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={goToRegister}
                  className="px-5 py-2 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white text-sm font-medium rounded shadow-sm transition-colors"
                >
                  Criar Conta
                </button>
              </>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Visual Formal */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Imagem de fundo do Tribunal */}
        <div className="absolute inset-0">
          <Image
            src="/images/tribunais/Tribunal-Supremo-novo.png"
            alt="Tribunal Supremo de Angola"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay com gradiente para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/85 to-primary-700/80"></div>
        </div>

        {/* Padrão decorativo formal */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                <BellAlertIcon className="w-4 h-4" />
                <span>Sistema oficial do Ministério da Justiça</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Gestão Judicial<br />
                <span className="text-primary-400">para Angola</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Plataforma integrada para gestão de processos penais, consulta de legislação 
                e análise de dados judiciais. Desenvolvido para magistrados, advogados, 
                procuradores e estudantes de Direito.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={goToRegister}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white font-semibold rounded hover:shadow-xl transition-all hover:scale-105"
                >
                  Começar Agora
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <a
                  href="#modulos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-primary-400 text-white font-medium rounded hover:bg-primary-400/20 transition-colors"
                >
                  Conhecer Funcionalidades
                </a>
              </div>

              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">Gratuito para órgãos públicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">Dados seguros</span>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estatisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded mb-3">
                  <stat.icon className="w-6 h-6 text-primary-800" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.numero}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos/Funcionalidades */}
      <section id="modulos" className="relative py-20 overflow-hidden bg-gray-50">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades do Sistema
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ferramentas desenvolvidas para facilitar o trabalho de profissionais do Direito, 
              com interface profissional e adaptada ao contexto jurídico angolano.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modulos.map((modulo, index) => (
              <div
                key={index}
                className="group p-5 bg-white border border-gray-200 rounded hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary-50 group-hover:bg-primary-100 rounded flex items-center justify-center mb-3 transition-colors">
                  <modulo.icon className="w-5 h-5 text-primary-800" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{modulo.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{modulo.descricao}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={goToRegister}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-800 hover:bg-primary-900 text-white font-semibold rounded shadow-sm transition-colors"
            >
              Aceder ao Sistema
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Notícias e Atualizações */}
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Actualizações Legislativas e Jurisprudenciais
              </h2>
              <p className="text-lg text-gray-600">
                Mantenha-se informado sobre novas leis, alterações de artigos e jurisprudência relevante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loadingAtualizacoes ? (
              <div className="col-span-3 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
              </div>
            ) : atualizacoes.length > 0 ? (
              atualizacoes.map((atualizacao) => (
                <AtualizacaoCard key={atualizacao.id} atualizacao={atualizacao} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <p>Nenhuma atualização disponível no momento.</p>
              </div>
            )}
          </div>
          
          {/* Link para todas as atualizações */}
          {atualizacoes.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  localStorage.setItem('returnUrl', '/jurisprudencia');
                  router.push('/login');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-800 text-white rounded hover:bg-primary-900 transition-colors"
              >
                Ver todas as actualizações
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mapa de Angola - Cobertura Nacional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 rounded text-primary-800 text-sm font-medium mb-6">
                <MapIcon className="w-4 h-4" />
                <span>Cobertura Nacional</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Presente em Todas as 18 Províncias de Angola
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Sistema Penal abrange todo o território nacional, permitindo gestão 
                unificada de processos judiciais desde Cabinda ao Cunene.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { provincia: 'Luanda', processos: '45%', icon: '🏛️' },
                  { provincia: 'Benguela', processos: '12%', icon: '⚖️' },
                  { provincia: 'Huambo', processos: '8%', icon: '📋' },
                  { provincia: 'Huíla', processos: '7%', icon: '🔍' },
                ].map((item: { provincia: string; processos: string; icon: string }, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3 hover:bg-primary-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.provincia}</p>
                        <p className="text-xs text-gray-500">{item.processos} dos processos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre/Para quem é */}
      <section id="sobre" className="relative py-20 overflow-hidden bg-white">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Desenvolvido para Profissionais do Direito em Angola
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Sistema Penal foi concebido com foco na eficiência e profissionalismo, 
                permitindo que magistrados, advogados e estudantes concentrem-se no que 
                realmente importa: fazer justiça.
              </p>

              <div className="space-y-3">
                {[
                  { icon: UserGroupIcon, text: 'Magistrados e Juízes - Gestão completa de processos e decisões' },
                  { icon: BuildingLibraryIcon, text: 'Procuradores - Acompanhamento de denúncias e acusações' },
                  { icon: ScaleIcon, text: 'Advogados - Consulta de jurisprudência e legislação' },
                  { icon: AcademicCapIcon, text: 'Estudantes - Modo de estudo com casos práticos' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary-800" />
                    </div>
                    <p className="text-gray-700 pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="bg-white rounded p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Pronto para começar?
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie a sua conta gratuitamente e tenha acesso a todas as funcionalidades do sistema.
                </p>
                <button
                  onClick={goToRegister}
                  className="block w-full py-3 bg-primary-800 hover:bg-primary-900 text-white text-center font-semibold rounded transition-colors"
                >
                  Criar Conta Gratuita
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Já tem conta?{' '}
                  <button onClick={goToLogin} className="text-primary-700 hover:underline font-medium">
                    Faça login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Gradiente institucional */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Barra decorativa */}
          <div className="flex h-1 rounded-full overflow-hidden mb-8">
            <div className="flex-1 bg-primary-800"></div>
            <div className="flex-1 bg-primary-700"></div>
            <div className="flex-1 bg-primary-600"></div>
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
              <p className="text-white/80 text-sm">
                © {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos
              </p>
              <p className="text-white/60 text-xs mt-1">
                Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
